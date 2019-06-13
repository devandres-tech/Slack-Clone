"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _auth = require("../auth");

var _FormatErrors = _interopRequireDefault(require("../FormatErrors"));

var _permissions = _interopRequireDefault(require("../permissions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  User: {
    teams: (parent, args, {
      models,
      user
    }) => models.sequelize.query('select * from teams as t join members as m on t.id = m.team_id where m.user_id = ?', {
      replacements: [user.id],
      model: models.Team,
      raw: true
    })
  },
  Query: {
    me: _permissions.default.createResolver((parent, args, {
      models,
      user
    }) => models.User.findOne({
      where: {
        id: user.id
      }
    })),
    getAllUsers: (parent, args, {
      models
    }) => models.User.findAll(),
    getUser: (parent, {
      userId
    }, {
      models
    }) => models.User.findOne({
      where: {
        id: userId
      }
    })
  },
  Mutation: {
    login: (parent, {
      email,
      password
    }, {
      models,
      SECRET,
      SECRET2
    }) => (0, _auth.tryLogin)(email, password, models, SECRET, SECRET2),
    register: async (parent, args, {
      models
    }) => {
      // hash password before creating user
      try {
        const user = await models.User.create(args);
        return {
          ok: true,
          user
        };
      } catch (err) {
        return {
          ok: false,
          errors: (0, _FormatErrors.default)(err, models)
        };
      }
    }
  }
};
exports.default = _default;