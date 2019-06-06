import formatErrors from '../FormatErrors';
import requiresAuth from '../permissions';


export default {
  Mutation: {
    createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const member = await models.Member.findOne({ where: { teamId: args.teamId, userId: user.id } }, { raw: true });
        if (!member.admin) {
          return {
            ok: false,
            errors: [
              {
                path: 'name',
                message: 'You have to be the owner to create channels',
              },
            ],
          };
        }

        const response = await models.sequelize.transaction(async (transaction) => {
          const channel = await models.Channel.create(args, { transaction });
          // create the private channel with all of the memebers
          if (!args.public) {
            // filter user if already on the members list
            const members = args.members.filter(m => m !== user.id);
            members.push(user.id);
            const privateChannelMembers = members.map(m => ({ userId: m, channelId: channel.dataValues.id }));
            // create private channel
            console.log('members ', privateChannelMembers);
            await models.PrivateChannelMember.bulkCreate(privateChannelMembers, { transaction });
          }
          return channel;
        });

        return {
          ok: true,
          channel: response,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
  },
};
