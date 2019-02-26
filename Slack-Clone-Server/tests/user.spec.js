import axios from 'axios';
import regeneratorRuntime from 'regenerator-runtime';

describe('user resolvers', () => {
  test('getAllUsers', async () => {
    const response = await axios.post('http://localhost:4040/graphql', {
      query: `
        query {
          allUsers {
            id
            username
            email
          }
        }  
      `,
    });

    const { data } = response;
    expect(data).toMatchObject({

      data: {
        getAllUsers: [
          {
            id: 1,
            username: 'luis',
            email: 'luis@email.com',
          },
          {
            id: 2,
            username: 'bob',
            email: 'bob@email.com',
          },
          {
            id: 3,
            username: 'mike',
            email: 'mike@email.com',
          },
        ],
      },

    });
  });
});
