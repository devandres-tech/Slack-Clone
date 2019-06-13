"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _path = _interopRequireDefault(require("path"));

var _dataloader = _interopRequireDefault(require("dataloader"));

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

var _cors = _interopRequireDefault(require("cors"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _http = _interopRequireDefault(require("http"));

var _auth = require("./auth");

var _batchFunctions = require("./batchFunctions");

var _models = _interopRequireDefault(require("./models"));

var SECRET = 'mysupresecretstring!';
var SECRET2 = 'mysecondesupersecret!';
var typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)((0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, './schema')));
var resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)((0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, './resolvers')));

_dotenv.default.config();

var app = (0, _express.default)();
app.use((0, _cors.default)('*'));
/** Middleware to verify user */

var addUser =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(req, res, next) {
    var token, _jwt$verify, user, refreshToken, newTokens;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.headers['x-token'];

            if (!token) {
              _context.next = 15;
              break;
            }

            _context.prev = 2;
            // verify with same SECRET we used to sign the token
            _jwt$verify = _jsonwebtoken.default.verify(token, SECRET), user = _jwt$verify.user;
            req.user = user;
            _context.next = 15;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](2);
            // set new tokens
            refreshToken = req.headers['x-refresh-token'];
            _context.next = 12;
            return (0, _auth.refreshTokens)(token, refreshToken, _models.default, SECRET, SECRET2);

          case 12:
            newTokens = _context.sent;

            if (newTokens.token && newTokens.refreshToken) {
              res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
              res.set('x-token', newTokens.token);
              res.set('x-refresh-token', newTokens.refreshToken);
            }

            req.user = newTokens.user;

          case 15:
            next();

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 7]]);
  }));

  return function addUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

app.use(addUser);
var server = new _apolloServerExpress.ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: function () {
    var _context2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2(_ref2) {
      var req, connection;
      return _regenerator.default.wrap(function _callee2$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              req = _ref2.req, connection = _ref2.connection;
              return _context3.abrupt("return", {
                models: _models.default,
                user: connection ? connection.context : req.user,
                SECRET: SECRET,
                SECRET2: SECRET2,
                // Make new dataloader per request due to caching
                channelLoader: new _dataloader.default(function (ids) {
                  return (0, _batchFunctions.channelBatcher)(ids, _models.default, req.user);
                }) // serverUrl: `${req.protocol}://${req.get('host')}`,

              });

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee2);
    }));

    function context(_x4) {
      return _context2.apply(this, arguments);
    }

    return context;
  }(),
  subscriptions: {
    onConnect: function () {
      var _onConnect = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(_ref3, webSocket) {
        var token, refreshToken, _jwt$verify2, user, newTokens;

        return _regenerator.default.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                token = _ref3.token, refreshToken = _ref3.refreshToken;

                if (!(token && refreshToken)) {
                  _context4.next = 13;
                  break;
                }

                _context4.prev = 2;
                // verify with same SECRET we used to sign the token
                _jwt$verify2 = _jsonwebtoken.default.verify(token, SECRET), user = _jwt$verify2.user;
                return _context4.abrupt("return", {
                  models: _models.default,
                  user: user
                });

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](2);
                _context4.next = 11;
                return (0, _auth.refreshTokens)(token, refreshToken, _models.default, SECRET, SECRET2);

              case 11:
                newTokens = _context4.sent;
                return _context4.abrupt("return", {
                  models: _models.default,
                  user: newTokens.user
                });

              case 13:
                return _context4.abrupt("return", {
                  models: _models.default
                });

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee3, null, [[2, 7]]);
      }));

      function onConnect(_x5, _x6) {
        return _onConnect.apply(this, arguments);
      }

      return onConnect;
    }()
  },
  uploads: {
    maxFileSize: 10000000,
    // 10 MB
    maxFiles: 20
  }
});
app.use('/file-uploads', _express.default.static('./file-uploads'));
server.applyMiddleware({
  app: app
});

var httpServer = _http.default.createServer(app); // install websocket subscriptions


server.installSubscriptionHandlers(httpServer); // serves static files
// sync() will create all tables if they doesn't exist in database
// before running the sever

_models.default.sequelize.sync({}).then(function () {
  httpServer.listen(process.env.PORT, function () {
    console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(process.env.PORT).concat(server.graphqlPath));
    console.log("\uD83D\uDE80 Subscriptions ready at ws://localhost:".concat(process.env.PORT).concat(server.subscriptionsPath));
  });
});