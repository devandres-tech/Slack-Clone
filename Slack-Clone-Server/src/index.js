import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import path from 'path';
import DataLoader from 'dataloader';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import http from 'http';


import { refreshTokens } from './auth';
import { channelBatcher } from './batchFunctions';
import models from './models';

const SECRET = 'mysupresecretstring!';
const SECRET2 = 'mysecondesupersecret!';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

dotenv.config();

const app = express();
app.use(cors('*'));

/** Middleware to verify user */
const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      // verify with same SECRET we used to sign the token
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      // set new tokens
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => ({
    models,
    user: connection ? connection.context : req.user,
    SECRET,
    SECRET2,
    // Make new dataloader per request due to caching
    channelLoader: new DataLoader(ids => channelBatcher(ids, models, req.user)),
    // serverUrl: `${req.protocol}://${req.get('host')}`,
  }),
  subscriptions: {
    onConnect: async ({ token, refreshToken }, webSocket) => {
      if (token && refreshToken) {
        try {
          // verify with same SECRET we used to sign the token
          const { user } = jwt.verify(token, SECRET);
          return { models, user };
        } catch (err) {
          // set new tokens
          const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
          return { models, user: newTokens.user };
        }
      }
      return { models };
    },
  },
  uploads: {
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20,
  },
});

app.use('/file-uploads', express.static('./file-uploads'));
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
// install websocket subscriptions
server.installSubscriptionHandlers(httpServer);
// serves static files

// sync() will create all tables if they doesn't exist in database
// before running the sever
models.sequelize.sync({}).then(() => {
  httpServer.listen(4040, () => {
    console.log(`🚀 Server ready at http://localhost:4040${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:4040${server.subscriptionsPath}`);
  });
});
