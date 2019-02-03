import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import 'semantic-ui-css/semantic.min.css';


import Routes from './routes';
import * as serviceWorker from './serviceWorker';


/** Create apollo client */
const client = new ApolloClient({
  uri: 'http://localhost:4040/graphql',
});

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
serviceWorker.unregister();
