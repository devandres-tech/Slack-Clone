"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphqlSubscriptions = require("graphql-subscriptions");

var _fs = _interopRequireDefault(require("fs"));

var _shortid = _interopRequireDefault(require("shortid"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _permissions = _interopRequireWildcard(require("../permissions"));

var _pubsub = _interopRequireDefault(require("../pubsub"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UPLOAD_DIR = './file-uploads'; // Ensure upload directory exists.

_mkdirp.default.sync(UPLOAD_DIR);

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

const storeFS = ({
  stream,
  filename,
  mimetype
}) => {
  const id = _shortid.default.generate();

  const url = `${UPLOAD_DIR}/${id}.${mimetype.slice(mimetype.indexOf('/') + 1)}`;
  return new Promise((resolve, reject) => stream.on('error', error => {
    if (stream.truncated) {
      // Delete the truncated file.
      _fs.default.unlinkSync(url);
    }

    reject(error);
  }).pipe(_fs.default.createWriteStream(url)).on('error', error => reject(error)).on('finish', () => resolve({
    id,
    url
  })));
};

const processUpload = async upload => {
  const {
    createReadStream,
    filename,
    mimetype
  } = await upload;
  const stream = createReadStream();
  const {
    id,
    url
  } = await storeFS({
    stream,
    filename,
    mimetype
  });
  return {
    url,
    filetype: mimetype
  };
};

var _default = {
  Subscription: {
    newChannelMessage: {
      subscribe: _permissions.requiresTeamAccess.createResolver((0, _graphqlSubscriptions.withFilter)(() => _pubsub.default.asyncIterator(NEW_CHANNEL_MESSAGE), (payload, args) => payload.channelId === args.channelId))
    }
  },
  Message: {
    // set url for static files
    url: parent => parent.url ? `http://localhost:4040/${parent.url}` : parent.url,
    user: ({
      user,
      userId
    }, args, {
      models
    }) => {
      if (user) {
        return user;
      }

      return models.User.findOne({
        where: {
          id: userId
        }
      }, {
        raw: true
      });
    }
  },
  Query: {
    messages: _permissions.default.createResolver(async (parent, {
      offset,
      channelId
    }, {
      models,
      user
    }) => {
      // check if the channel is public
      const channel = await models.Channel.findOne({
        raw: true,
        where: {
          id: channelId
        }
      }); // Guard messages for private channels

      if (!channel.public) {
        const member = await models.PrivateChannelMember.findOne({
          raw: true,
          where: {
            channelId,
            userId: user.id
          }
        });

        if (!member) {
          throw new Error('Not Authorized');
        }
      }

      return models.Message.findAll({
        order: [['created_at', 'DESC']],
        where: {
          channelId
        },
        limit: 25,
        offset
      }, {
        raw: true
      });
    })
  },
  Mutation: {
    createMessage: _permissions.default.createResolver(async (parent, {
      file,
      ...args
    }, {
      models,
      user
    }) => {
      try {
        const messageData = args;

        if (file) {
          const {
            url,
            filetype
          } = await processUpload(file);
          messageData.url = url;
          messageData.filetype = filetype;
        }

        if (!messageData.filetype) {
          messageData.filetype = 'text/plain';
        }

        const message = await models.Message.create({ ...messageData,
          userId: user.id
        });

        const asyncFunc = async () => {
          const currentUser = await models.User.findOne({
            where: {
              id: user.id
            }
          });

          _pubsub.default.publish(NEW_CHANNEL_MESSAGE, {
            channelId: args.channelId,
            newChannelMessage: { ...message.dataValues,
              user: currentUser.dataValues
            }
          });
        };

        asyncFunc();
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    })
  }
};
exports.default = _default;