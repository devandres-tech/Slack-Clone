"use strict";

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SECRET = 'mysupresecretstring!';
const SECRET2 = 'mysecondesupersecret!';
const typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)((0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, './schema')));
const resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)((0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, './resolvers')));

_dotenv.default.config();

const app = (0, _express.default)();
app.use((0, _cors.default)('*'));
/** Middleware to verify user */

const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      // verify with same SECRET we used to sign the token
      const {
        user
      } = _jsonwebtoken.default.verify(token, SECRET);

      req.user = user;
    } catch (err) {
      // set new tokens
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await (0, _auth.refreshTokens)(token, refreshToken, _models.default, SECRET, SECRET2);

      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }

      req.user = newTokens.user;
    }
  }

  next();
};

app.use(addUser);
const server = new _apolloServerExpress.ApolloServer({
  typeDefs,
  resolvers,
  context: async ({
    req,
    connection
  }) => ({
    models: _models.default,
    user: connection ? connection.context : req.user,
    SECRET,
    SECRET2,
    // Make new dataloader per request due to caching
    channelLoader: new _dataloader.default(ids => (0, _batchFunctions.channelBatcher)(ids, _models.default, req.user)) // serverUrl: `${req.protocol}://${req.get('host')}`,

  }),
  subscriptions: {
    onConnect: async ({
      token,
      refreshToken
    }, webSocket) => {
      if (token && refreshToken) {
        try {
          // verify with same SECRET we used to sign the token
          const {
            user
          } = _jsonwebtoken.default.verify(token, SECRET);

          return {
            models: _models.default,
            user
          };
        } catch (err) {
          // set new tokens
          const newTokens = await (0, _auth.refreshTokens)(token, refreshToken, _models.default, SECRET, SECRET2);
          return {
            models: _models.default,
            user: newTokens.user
          };
        }
      }

      return {
        models: _models.default
      };
    }
  },
  uploads: {
    maxFileSize: 10000000,
    // 10 MB
    maxFiles: 20
  }
});
app.use('/file-uploads', _express.default.static('./file-uploads'));
server.applyMiddleware({
  app
});

const httpServer = _http.default.createServer(app); // install websocket subscriptions


server.installSubscriptionHandlers(httpServer); // serves static files
// sync() will create all tables if they doesn't exist in database
// before running the sever

_models.default.sequelize.sync({}).then(() => {
  httpServer.listen(4040, () => {
    console.log(`🚀 Server ready at http://localhost:4040${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:4040${server.subscriptionsPath}`);
  });
});