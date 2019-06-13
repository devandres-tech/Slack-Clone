"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

/** Create a 'User' table */
var _default = function _default(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'Username must only contain letters and numbers'
        },
        len: {
          args: [3, 25],
          msg: 'The username needs to be between 3 and 25 characters long'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 100],
          msg: 'The password must be between 5 and 100 characters long'
        }
      }
    }
  }, {
    hooks: {
      afterValidate: function () {
        var _afterValidate = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee(user) {
          var hashedPassword;
          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _bcrypt.default.hash(user.password, 12);

                case 2:
                  hashedPassword = _context.sent;
                  // eslint-disable-next-line no-param-reassign
                  user.password = hashedPassword;

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function afterValidate(_x) {
          return _afterValidate.apply(this, arguments);
        }

        return afterValidate;
      }()
    }
  }); // Define associations

  User.associate = function (models) {
    User.belongsToMany(models.Team, {
      through: models.Member,
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    }); // One to Many

    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    }); // One to Many

    User.belongsToMany(models.Channel, {
      through: models.PrivateChannelMember,
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
  };

  return User;
};

exports.default = _default;