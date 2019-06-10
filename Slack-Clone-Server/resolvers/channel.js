import formatErrors from '../FormatErrors';
import requiresAuth from '../permissions';


export default {
  Mutation: {
    getOrCreateChannel: requiresAuth.createResolver(async (parent, { teamId, members }, { models, user }) => {
      const allMembers = [...members, user.id];
      // check if dm channel already exists with these members
      const [data, result] = await models.sequelize.query(`
        select c.id 
        from channels as c, private_channel_members as pc 
        where pc.channel_id = c.id and c.dm = true and c.public = false and c.team_id = ${teamId}
        group by c.id
        having array_agg(pc.user_id) @> Array[${allMembers.join(',')}] and count(pc.user_id) = ${allMembers.length};
      `, { raw: true });
      console.log('data and result', data, result);

      if (data.length) {
        return data[0].id;
      }

      // Find all usernames associated with members
      const users = await models.User.findAll({
        raw: true,
        where: {
          userId: {
            [models.sequelize.Op.in]: members,
          },
        },
      });

      const channelId = await models.sequelize.transaction(async (transaction) => {
        const channel = await models.Channel.create({
          name: 'hello yoooo',
          public: false,
          dm: true,
          teamId,
        }, { transaction });
        // create the private channel with all of the members

        // filter user if already on the members list
        const cId = channel.dataValues.id;
        const privateChannelMembers = allMembers.map(m => ({ userId: m, channelId: cId }));
        // create private channel
        await models.PrivateChannelMember.bulkCreate(privateChannelMembers, { transaction });
        return cId;
      });
      return channelId;
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
          // create the private channel with all of the members
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
