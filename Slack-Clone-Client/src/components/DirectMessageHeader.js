import React from 'react';
import { Header } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import { GET_USER_QUERY } from '../graphql/user';

export default ({ userId }) => (

  <Query
    query={GET_USER_QUERY}
    variables={{ userId }}
  >
    {({ loading, error, data: { getUser } }) => {
      if (loading) return <p>Loading...</p>;
      console.log('data', userId);
      return (
        <div className="header">
          <Header textAlign="center">
            #
            {' '}
            {getUser.username}
          </Header>
        </div>
      );
    }}

  </Query>
);
