"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.directMessageSubscription = exports.requiresTeamAccess = exports.default = void 0;

const createResolver = resolver => {
  const baseResolver = resolver;

  baseResolver.createResolver = childResolver => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };

    return createResolver(newResolver);
  };

  return baseResolver;
};
/** Requires Authentication */


var _default = createResolver((parent, args, {
  user
}) => {
  if (!user || !user.id) {
    throw new Error('Not authenticated');
  }
});
/** Fetch the channel we are trying to subscribe, and check
 * if you are a member of the team through our member table
 */


exports.default = _default;
const requiresTeamAccess = createResolver(async (parent, {
  channelId
}, {
  user,
  models
}) => {
  if (!user || !user.user.id) {
    throw new Error('Not authenticated, must require acesss');
  } // check if part of the team


  const channel = await models.Channel.findOne({
    where: {
      id: channelId
    }
  });
  const member = await models.Member.findOne({
    where: {
      teamId: channel.teamId,
      userId: user.user.id
    }
  });

  if (!member) {
    throw new Error('You are not a member of this team, please request an invite');
  }
});
exports.requiresTeamAccess = requiresTeamAccess;
const directMessageSubscription = createResolver(async (parent, {
  teamId,
  userId
}, {
  user,
  models
}) => {
  if (!user || !user.user.id) {
    throw new Error('Not authenticated, must require acesss');
  } // Find members that will be subscribed


  const members = await models.Member.findAll({
    where: {
      teamId,
      [models.sequelize.Op.or]: [{
        userId
      }, {
        userId: user.user.id
      }]
    }
  });

  if (members.length !== 2) {
    throw new Error('something went wrong!');
  }
});
exports.directMessageSubscription = directMessageSubscription;