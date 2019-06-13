"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _FormatErrors = _interopRequireDefault(require("../FormatErrors"));

var _permissions = _interopRequireDefault(require("../permissions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Mutation: {
    getOrCreateChannel: _permissions.default.createResolver(async (parent, {
      teamId,
      members
    }, {
      models,
      user
    }) => {
      const member = await models.Member.findOne({
        where: {
          teamId,
          userId: user.id
        }
      }, {
        raw: true
      });

      if (!member) {
        throw new Error('Not Authorized');
      }

      const allMembers = [...members, user.id]; // check if dm channel already exists with these members

      const [data, result] = await models.sequelize.query(`
        select c.id, c.name 
        from channels as c, private_channel_members as pc 
        where pc.channel_id = c.id and c.dm = true and c.public = false and c.team_id = ${teamId}
        group by c.id, c.name
        having array_agg(pc.user_id) @> Array[${allMembers.join(',')}] and count(pc.user_id) = ${allMembers.length};
      `, {
        raw: true
      });

      if (data.length) {
        return data[0];
      } // Find all usernames associated with members


      const users = await models.User.findAll({
        raw: true,
        where: {
          id: {
            [models.sequelize.Op.in]: members
          }
        }
      });
      console.log('users found', users); // create the username string

      const name = users.map(foundUser => foundUser.username).join(', ');
      const channelId = await models.sequelize.transaction(async transaction => {
        const channel = await models.Channel.create({
          name,
          public: false,
          dm: true,
          teamId
        }, {
          transaction
        }); // create the private channel with all of the members
        // filter user if already on the members list

        const cId = channel.dataValues.id;
        const privateChannelMembers = allMembers.map(m => ({
          userId: m,
          channelId: cId
        })); // create private channel

        await models.PrivateChannelMember.bulkCreate(privateChannelMembers, {
          transaction
        });
        return cId;
      });
      return {
        id: channelId,
        name
      };
    }),
    createChannel: _permissions.default.createResolver(async (parent, args, {
      models,
      user
    }) => {
      try {
        const member = await models.Member.findOne({
          where: {
            teamId: args.teamId,
            userId: user.id
          }
        }, {
          raw: true
        });

        if (!member.admin) {
          return {
            ok: false,
            errors: [{
              path: 'name',
              message: 'You have to be the owner to create channels'
            }]
          };
        }

        const response = await models.sequelize.transaction(async transaction => {
          const channel = await models.Channel.create(args, {
            transaction
          }); // create the private channel with all of the members

          if (!args.public) {
            // filter user if already on the members list
            const members = args.members.filter(m => m !== user.id);
            members.push(user.id);
            const privateChannelMembers = members.map(m => ({
              userId: m,
              channelId: channel.dataValues.id
            })); // create private channel

            console.log('members ', privateChannelMembers);
            await models.PrivateChannelMember.bulkCreate(privateChannelMembers, {
              transaction
            });
          }

          return channel;
        });
        return {
          ok: true,
          channel: response
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: (0, _FormatErrors.default)(err, models)
        };
      }
    })
  }
};
exports.default = _default;