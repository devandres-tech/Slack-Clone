import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';


const allUsersQuery = gql`
  {
    getAllUsers {
      id
      email
      username
    }
  }
`;

const Home = () => (
  <Query query={allUsersQuery}>
    {({ loading, data }) => {
      if (loading) return 'loading';
      const { getAllUsers } = data;
      return getAllUsers.map(u => <h1 key={u.id}>{u.email}</h1>);
    }}
  </Query>
);


export default Home;
