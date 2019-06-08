import formatErrors from '../FormatErrors';
import requiresAuth from '../permissions';


export default {
  Mutation: {
    getOrCreateChannel: requiresAuth.createResolver(async (parent, { teamId, members }, { models, user }) => {
      members.push(user.id);
      // check if dm channel already exists with these members
      const response = await models.sequelize.query(`
        select c.id 
        from channels as c, private_channel_members as pc 
        where pc.channel_id = c.id, c.dm = true, c.public = false, c.team_id = ${teamId}
        group by c.id
        having array_agg(pc.user_id) @> Array[${members.join(',')}] and count(pc.user_id) = ${members.length};
      `, { raw: true });
      console.log('res is ', response);
      return 1;
    }),
    createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const member = await models.Member.findOne(
          {
            where: { teamId: args.teamId, userId: user.id },
          },
          {
            raw: true,
          },
        );
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
