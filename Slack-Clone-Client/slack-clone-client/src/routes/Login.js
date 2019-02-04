import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { Button, Input, Container, Header } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const LOGIN_MUTATION = gql`
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    ok
    token
    refreshToken
    errors {
      path
      message
    }
  }
}
`;

export default observer(class Login extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      email: '',
      password: '',
    });
  }

  onSubmit = async (login) => {
    const { email, password } = this;
    const response = await login({ variables: { email, password } });
    const { ok, token, refreshToken } = response.data.login;

    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  render() {
    const { email, password } = this;

    return (
      <Mutation mutation={LOGIN_MUTATION}>
        {(login) => {
          return (
            <Container text>
              <Header as="h2">Login</Header>

              <Input
                name="email"
                onChange={this.onChange}
                value={email}
                fluid
                placeholder="Email"
              />

              <Input
                onChange={this.onChange}
                value={password}
                fluid
                name="password"
                type="password"
                placeholder="Password"
              />
              <Button onClick={() => this.onSubmit(login)}>Submit</Button>
            </Container>
          );
        }}
      </Mutation>
    );
  }
});
