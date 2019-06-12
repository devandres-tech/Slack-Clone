import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { GET_ALL_USERS } from '../graphql/user';

const Home = () => (
  <Query query={GET_ALL_USERS}>
    {({ loading, data }) => (
      <div className="home-container">
        <div className="home-container__description">
          <h1 className="home-container__title">
            Slack Clone
            <i className="fab fa-slack" />
          </h1>
          <p className="home-container__info">
            Welcome to this slack clone. Just login (can be a fake email)
            to start messaging. You can create teams, channels, and private group chats.
            Feel free to create a pull request!
          </p>
          {' '}
        </div>
        <div className="home-container__authentication">
          <Link className="home-container__authentication--login" to="/login"><h1>Login</h1></Link>
          <Link className="home-container__authentication--login" to="/register"><h1>Register</h1></Link>
        </div>
        <p className="copyright">
          {' '}
          &copy; 2019 Made with ❤️ by
          <a className="copyright__link" href="http://andresio.com"> Andres Alcocer</a>
        </p>
      </div>
      // if (loading) return 'loading';
      // const { getAllUsers } = data;
      // return getAllUsers.map(u => <h1 key={u.id}>{u.username}</h1>);
    )}
  </Query>
);


export default Home;
