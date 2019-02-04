import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import dotenv from 'dotenv';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';

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

const server = new ApolloServer({
  schema,
  context: {
    models,
    user: {
      id: 1,
    },
    SECRET,
    SECRET2,
  },
});

server.applyMiddleware({ app });

// sync() will create all tables if they doesn't exist in database
// before running the sever
models.sequelize.sync({ }).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/graphql`);
  });
});
