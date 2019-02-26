import axios from 'axios';

describe('user resolvers', () => {
  /** Test getting users */
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
        getAllUsers: [],
      },

    });
  });

  /** Test registering users */
  test('register user', async () => {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:4040/graphql',
      data: {
        query: `
         mutation {
          register(username: "luis", email: "luils@email.com", password: "luisluis") {
            ok 
            errors {
              path
              message
            }
            user {
              username
              email
            }
          }
        }
        `,
      },
    });
    const { data } = response;
    expect(data).toMatchObject({
      data: {
        register: {
          ok: true,
          errors: null,
          user: {
            username: 'luis',
            email: 'luils@email.com',
          },
        },
      },
    });

    const response2 = await axios({
      method: 'POST',
      url: 'http://localhost:4040/graphql',
      data: {
        query: `
          mutation {
            login(email: "luils@email.com", password: "luisluis") {
              token
              refreshToken
            }
          }
        `,
      },
    });

    const { data: { login: { token, refreshToken } } } = response2.data;

    const response3 = await axios({
      method: 'POST',
      url: 'http://localhost:4040/graphql',
      data: {
        query: `
          mutation {
            createTeam(name: "team1") {
              ok 
              team {
                name
              }
            }
          }
        `,
      },
      headers: {
        'x-token': token,
        'x-refresh-token': refreshToken,
      },
    });

    expect(response3.data).toMatchObject({
      data: {
        createTeam: {
          ok: true,
          team: {
            name: 'team1',
          },
        },
      },
    });
  });
});
