import { withFilter } from 'graphql-subscriptions';
import fs from 'fs';
import shortid from 'shortid';
import mkdirp from 'mkdirp';

import requiresAuth, { requiresTeamAccess } from '../permissions';
import pubsub from '../pubsub';

const UPLOAD_DIR = './file-uploads';
// Ensure upload directory exists.
mkdirp.sync(UPLOAD_DIR);

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

const storeFS = ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  const url = `${UPLOAD_DIR}/${id}.${mimetype.slice(mimetype.indexOf('/') + 1)}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        if (stream.truncated) {
          // Delete the truncated file.
          fs.unlinkSync(url);
        }
        reject(error);
      })
      .pipe(fs.createWriteStream(url))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ id, url })));
};

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const { id, url } = await storeFS({ stream, filename, mimetype });
  return { url, filetype: mimetype };
};


export default {
  Subscription: {
    newChannelMessage: {
      subscribe: requiresTeamAccess.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId,
      )),
    },
  },

  Message: {
    // set url for static files
    url: parent => (parent.url ? `http://localhost:4040/${parent.url}` : parent.url),
    user: ({ user, userId }, args, { models }) => {
      if (user) {
        return user;
      }
      return models.User.findOne({ where: { id: userId } }, { raw: true });
    },
  },

  Query: {
    messages: requiresAuth.createResolver(async (parent, { offset, channelId }, { models, user }) => {
      // check if the channel is public
      const channel = await models.Channel.findOne({ raw: true, where: { id: channelId } });
      // Guard messages for private channels
      if (!channel.public) {
        const member = await models.PrivateChannelMember.findOne({
          raw: true,
          where: { channelId, userId: user.id },
        });
        if (!member) {
          throw new Error('Not Authorized');
        }
      }

      return models.Message.findAll(
        {
          order: [['created_at', 'ASC']], where: { channelId }, limit: 25, offset,
        },
        { raw: true },
      );
    }),
  },

  Mutation: {
    createMessage: requiresAuth.createResolver(async (parent, { file, ...args }, { models, user }) => {
      try {
        const messageData = args;
        if (file) {
          const { url, filetype } = await processUpload(file);
          messageData.url = url;
          messageData.filetype = filetype;
        }
        if (!messageData.filetype) {
          messageData.filetype = 'text/plain';
        }
        const message = await models.Message.create({
          ...messageData,
          userId: user.id,
        });

        const asyncFunc = async () => {
          const currentUser = await models.User.findOne({
            where: {
              id: user.id,
            },
          });

          pubsub.publish(NEW_CHANNEL_MESSAGE, {
            channelId: args.channelId,
            newChannelMessage: {
              ...message.dataValues,
              user: currentUser.dataValues,
            },
          });
        };

        asyncFunc();

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }),
  },
};
