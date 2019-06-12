import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import {
  Button, Input, Container, Header, Form, Message,
} from 'semantic-ui-react';
import { Mutation } from 'react-apollo';

import { LOGIN_MUTATION } from '../graphql/user';
import { wsLink } from '../apollo';


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
      wsLink.subscriptionClient.tryReconnect();
      this.props.history.push('/view-team');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
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
