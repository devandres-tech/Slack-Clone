import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import client from './apollo';
import 'semantic-ui-css/semantic.min.css';
import './static/sass/style.scss';


import Routes from './routes';
import * as serviceWorker from './serviceWorker';


const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
serviceWorker.unregister();
