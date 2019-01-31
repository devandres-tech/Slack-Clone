import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import dotenv from 'dotenv';

import typeDefs from './schema';
import resolvers from './resolver';
import models from './models';

dotenv.config();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

const server = new ApolloServer({ schema });
server.applyMiddleware({ app });

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/graphql`);
});
