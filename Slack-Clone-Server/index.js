import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import dotenv from 'dotenv';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import http from 'http';


import { refreshTokens } from './auth';

import models from './models';

const SECRET = 'mysupresecretstring!';
const SECRET2 = 'mysecondesupersecret!';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

dotenv.config();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

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
  schema,
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
  context: async ({ req, connection }) => ({
    models,
    user: connection ? connection.context : req.user,
    SECRET,
    SECRET2,
  }),
});

server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// sync() will create all tables if they doesn't exist in database
// before running the sever
models.sequelize.sync({}).then(() => {
  httpServer.listen(process.env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`);
  });
});
