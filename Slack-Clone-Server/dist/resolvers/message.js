"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _graphqlSubscriptions = require("graphql-subscriptions");

var _fs = _interopRequireDefault(require("fs"));

var _shortid = _interopRequireDefault(require("shortid"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _permissions = _interopRequireWildcard(require("../permissions"));

var _pubsub = _interopRequireDefault(require("../pubsub"));

var UPLOAD_DIR = './file-uploads'; // Ensure upload directory exists.

_mkdirp.default.sync(UPLOAD_DIR);

var NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

var storeFS = function storeFS(_ref) {
  var stream = _ref.stream,
      filename = _ref.filename,
      mimetype = _ref.mimetype;

  var id = _shortid.default.generate();

  var url = "".concat(UPLOAD_DIR, "/").concat(id, ".").concat(mimetype.slice(mimetype.indexOf('/') + 1));
  return new Promise(function (resolve, reject) {
    return stream.on('error', function (error) {
      if (stream.truncated) {
        // Delete the truncated file.
        _fs.default.unlinkSync(url);
      }

      reject(error);
    }).pipe(_fs.default.createWriteStream(url)).on('error', function (error) {
      return reject(error);
    }).on('finish', function () {
      return resolve({
        id: id,
        url: url
      });
    });
  });
};

var processUpload =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(upload) {
    var _ref3, createReadStream, filename, mimetype, stream, _ref4, id, url;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return upload;

          case 2:
            _ref3 = _context.sent;
            createReadStream = _ref3.createReadStream;
            filename = _ref3.filename;
            mimetype = _ref3.mimetype;
            stream = createReadStream();
            _context.next = 9;
            return storeFS({
              stream: stream,
              filename: filename,
              mimetype: mimetype
            });

          case 9:
            _ref4 = _context.sent;
            id = _ref4.id;
            url = _ref4.url;
            return _context.abrupt("return", {
              url: url,
              filetype: mimetype
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function processUpload(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = {
  Subscription: {
    newChannelMessage: {
      subscribe: _permissions.requiresTeamAccess.createResolver((0, _graphqlSubscriptions.withFilter)(function () {
        return _pubsub.default.asyncIterator(NEW_CHANNEL_MESSAGE);
      }, function (payload, args) {
        return payload.channelId === args.channelId;
      }))
    }
  },
  Message: {
    // set url for static files
    url: function url(parent) {
      return parent.url ? "http://localhost:4040/".concat(parent.url) : parent.url;
    },
    user: function user(_ref5, args, _ref6) {
      var _user = _ref5.user,
          userId = _ref5.userId;
      var models = _ref6.models;

      if (_user) {
        return _user;
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
    messages: _permissions.default.createResolver(
    /*#__PURE__*/
    function () {
      var _ref9 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(parent, _ref7, _ref8) {
        var offset, channelId, models, user, channel, member;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                offset = _ref7.offset, channelId = _ref7.channelId;
                models = _ref8.models, user = _ref8.user;
                _context2.next = 4;
                return models.Channel.findOne({
                  raw: true,
                  where: {
                    id: channelId
                  }
                });

              case 4:
                channel = _context2.sent;

                if (channel.public) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 8;
                return models.PrivateChannelMember.findOne({
                  raw: true,
                  where: {
                    channelId: channelId,
                    userId: user.id
                  }
                });

              case 8:
                member = _context2.sent;

                if (member) {
                  _context2.next = 11;
                  break;
                }

                throw new Error('Not Authorized');

              case 11:
                return _context2.abrupt("return", models.Message.findAll({
                  order: [['created_at', 'DESC']],
                  where: {
                    channelId: channelId
                  },
                  limit: 25,
                  offset: offset
                }, {
                  raw: true
                }));

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2, _x3, _x4) {
        return _ref9.apply(this, arguments);
      };
    }())
  },
  Mutation: {
    createMessage: _permissions.default.createResolver(
    /*#__PURE__*/
    function () {
      var _ref12 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4(parent, _ref10, _ref11) {
        var file, args, models, user, messageData, _ref13, url, filetype, message, asyncFunc;

        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                file = _ref10.file, args = (0, _objectWithoutProperties2.default)(_ref10, ["file"]);
                models = _ref11.models, user = _ref11.user;
                _context4.prev = 2;
                messageData = args;

                if (!file) {
                  _context4.next = 12;
                  break;
                }

                _context4.next = 7;
                return processUpload(file);

              case 7:
                _ref13 = _context4.sent;
                url = _ref13.url;
                filetype = _ref13.filetype;
                messageData.url = url;
                messageData.filetype = filetype;

              case 12:
                if (!messageData.filetype) {
                  messageData.filetype = 'text/plain';
                }

                _context4.next = 15;
                return models.Message.create((0, _objectSpread2.default)({}, messageData, {
                  userId: user.id
                }));

              case 15:
                message = _context4.sent;

                asyncFunc =
                /*#__PURE__*/
                function () {
                  var _ref14 = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee3() {
                    var currentUser;
                    return _regenerator.default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return models.User.findOne({
                              where: {
                                id: user.id
                              }
                            });

                          case 2:
                            currentUser = _context3.sent;

                            _pubsub.default.publish(NEW_CHANNEL_MESSAGE, {
                              channelId: args.channelId,
                              newChannelMessage: (0, _objectSpread2.default)({}, message.dataValues, {
                                user: currentUser.dataValues
                              })
                            });

                          case 4:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function asyncFunc() {
                    return _ref14.apply(this, arguments);
                  };
                }();

                asyncFunc();
                return _context4.abrupt("return", true);

              case 21:
                _context4.prev = 21;
                _context4.t0 = _context4["catch"](2);
                console.log(_context4.t0);
                return _context4.abrupt("return", false);

              case 25:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[2, 21]]);
      }));

      return function (_x5, _x6, _x7) {
        return _ref12.apply(this, arguments);
      };
    }())
  }
};
exports.default = _default;