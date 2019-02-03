import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';


const GET_ALL_USERS = gql`
  {
    getAllUsers {
      id
      email
      username
    }
  }
`;

const Home = () => (
  <Query query={GET_ALL_USERS}>
    {({ loading, data }) => {
      if (loading) return 'loading';
      const { getAllUsers } = data;
      return getAllUsers.map(u => <h1 key={u.id}>{u.username}</h1>);
    }}
  </Query>
);


export default Home;
