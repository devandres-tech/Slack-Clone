"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _FormatErrors = _interopRequireDefault(require("../FormatErrors"));

var _permissions = _interopRequireDefault(require("../permissions"));

var _default = {
  Mutation: {
    getOrCreateChannel: _permissions.default.createResolver(
    /*#__PURE__*/
    function () {
      var _ref3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(parent, _ref, _ref2) {
        var teamId, members, models, user, member, allMembers, _ref4, _ref5, data, result, users, name, channelId;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                teamId = _ref.teamId, members = _ref.members;
                models = _ref2.models, user = _ref2.user;
                _context2.next = 4;
                return models.Member.findOne({
                  where: {
                    teamId: teamId,
                    userId: user.id
                  }
                }, {
                  raw: true
                });

              case 4:
                member = _context2.sent;

                if (member) {
                  _context2.next = 7;
                  break;
                }

                throw new Error('Not Authorized');

              case 7:
                allMembers = [].concat((0, _toConsumableArray2.default)(members), [user.id]); // check if dm channel already exists with these members

                _context2.next = 10;
                return models.sequelize.query("\n        select c.id, c.name \n        from channels as c, private_channel_members as pc \n        where pc.channel_id = c.id and c.dm = true and c.public = false and c.team_id = ".concat(teamId, "\n        group by c.id, c.name\n        having array_agg(pc.user_id) @> Array[").concat(allMembers.join(','), "] and count(pc.user_id) = ").concat(allMembers.length, ";\n      "), {
                  raw: true
                });

              case 10:
                _ref4 = _context2.sent;
                _ref5 = (0, _slicedToArray2.default)(_ref4, 2);
                data = _ref5[0];
                result = _ref5[1];

                if (!data.length) {
                  _context2.next = 16;
                  break;
                }

                return _context2.abrupt("return", data[0]);

              case 16:
                _context2.next = 18;
                return models.User.findAll({
                  raw: true,
                  where: {
                    id: (0, _defineProperty2.default)({}, models.sequelize.Op.in, members)
                  }
                });

              case 18:
                users = _context2.sent;
                console.log('users found', users); // create the username string

                name = users.map(function (foundUser) {
                  return foundUser.username;
                }).join(', ');
                _context2.next = 23;
                return models.sequelize.transaction(
                /*#__PURE__*/
                function () {
                  var _ref6 = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee(transaction) {
                    var channel, cId, privateChannelMembers;
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return models.Channel.create({
                              name: name,
                              public: false,
                              dm: true,
                              teamId: teamId
                            }, {
                              transaction: transaction
                            });

                          case 2:
                            channel = _context.sent;
                            // create the private channel with all of the members
                            // filter user if already on the members list
                            cId = channel.dataValues.id;
                            privateChannelMembers = allMembers.map(function (m) {
                              return {
                                userId: m,
                                channelId: cId
                              };
                            }); // create private channel

                            _context.next = 7;
                            return models.PrivateChannelMember.bulkCreate(privateChannelMembers, {
                              transaction: transaction
                            });

                          case 7:
                            return _context.abrupt("return", cId);

                          case 8:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x4) {
                    return _ref6.apply(this, arguments);
                  };
                }());

              case 23:
                channelId = _context2.sent;
                return _context2.abrupt("return", {
                  id: channelId,
                  name: name
                });

              case 25:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x, _x2, _x3) {
        return _ref3.apply(this, arguments);
      };
    }()),
    createChannel: _permissions.default.createResolver(
    /*#__PURE__*/
    function () {
      var _ref8 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4(parent, args, _ref7) {
        var models, user, member, response;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                models = _ref7.models, user = _ref7.user;
                _context4.prev = 1;
                _context4.next = 4;
                return models.Member.findOne({
                  where: {
                    teamId: args.teamId,
                    userId: user.id
                  }
                }, {
                  raw: true
                });

              case 4:
                member = _context4.sent;

                if (member.admin) {
                  _context4.next = 7;
                  break;
                }

                return _context4.abrupt("return", {
                  ok: false,
                  errors: [{
                    path: 'name',
                    message: 'You have to be the owner to create channels'
                  }]
                });

              case 7:
                _context4.next = 9;
                return models.sequelize.transaction(
                /*#__PURE__*/
                function () {
                  var _ref9 = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee3(transaction) {
                    var channel, members, privateChannelMembers;
                    return _regenerator.default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return models.Channel.create(args, {
                              transaction: transaction
                            });

                          case 2:
                            channel = _context3.sent;

                            if (args.public) {
                              _context3.next = 10;
                              break;
                            }

                            // filter user if already on the members list
                            members = args.members.filter(function (m) {
                              return m !== user.id;
                            });
                            members.push(user.id);
                            privateChannelMembers = members.map(function (m) {
                              return {
                                userId: m,
                                channelId: channel.dataValues.id
                              };
                            }); // create private channel

                            console.log('members ', privateChannelMembers);
                            _context3.next = 10;
                            return models.PrivateChannelMember.bulkCreate(privateChannelMembers, {
                              transaction: transaction
                            });

                          case 10:
                            return _context3.abrupt("return", channel);

                          case 11:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x8) {
                    return _ref9.apply(this, arguments);
                  };
                }());

              case 9:
                response = _context4.sent;
                return _context4.abrupt("return", {
                  ok: true,
                  channel: response
                });

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](1);
                console.log(_context4.t0);
                return _context4.abrupt("return", {
                  ok: false,
                  errors: (0, _FormatErrors.default)(_context4.t0, models)
                });

              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[1, 13]]);
      }));

      return function (_x5, _x6, _x7) {
        return _ref8.apply(this, arguments);
      };
    }())
  }
};
exports.default = _default;