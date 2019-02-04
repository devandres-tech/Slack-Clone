import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import {
  Button, Input, Container, Header, Form, Message,
} from 'semantic-ui-react';
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
      errors: {},
    });
  }

  onSubmit = async (login) => {
    const { email, password } = this;
    const response = await login({ variables: { email, password } });
    const {
      ok, token, refreshToken, errors,
    } = response.data.login;

    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        // err['passwordError'] = 'too long...'
        err[`${path}Error`] = message;
      });
      this.errors = err;
    }

    console.log(response);
  };

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  };

  render() {
    const { email, password, errors: { emailError, passwordError } } = this;

    const errorList = [];
    if (emailError) {
      errorList.push(emailError);
    }
    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <Mutation mutation={LOGIN_MUTATION}>
        {login => (
          <Container text>
            <Form>
              <Header as="h2">Login</Header>
              <Form.Field error={!!emailError}>
                <Input
                  name="email"
                  onChange={this.onChange}
                  value={email}
                  fluid
                  placeholder="Email"
                />
              </Form.Field>

              <Form.Field error={!!passwordError}>
                <Input
                  onChange={this.onChange}
                  value={password}
                  fluid
                  name="password"
                  type="password"
                  placeholder="Password"
                />
              </Form.Field>
              <Button onClick={() => this.onSubmit(login)}>Submit</Button>
            </Form>
            {errorList.length ? (
              <Message
                error
                header="There was some errors with your submission"
                list={errorList}
              />
            ) : null}
          </Container>
        )}
      </Mutation>
    );
  }
});
