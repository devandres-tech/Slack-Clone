import axios from 'axios';
import regeneratorRuntime from 'regenerator-runtime';

describe('user resolvers', () => {
  test('getAllUsers', async () => {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:4040/graphql',
      data: {
        query: `
          {
            getAllUsers {
              id
              username
              email
            }
          }
        `,
      },
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
