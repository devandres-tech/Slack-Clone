import React, { Component } from 'react';
import {
  Container, Header, Input, Button, Message, Form,
} from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { REGISTER_MUTATION } from '../graphql/user';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      usernameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
    };
  }

  /** Set the user input to our state */
  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  /** Submits form and creates a user on the database */
  onSubmit = async (register) => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });

    const { username, email, password } = this.state;
    const response = await register({
      variables: { username, email, password },
    });
    // Get our errors from backend
    const { ok, errors } = response.data.register;
    if (ok) {
      this.props.history.push('/login');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        // err['passwordError'] = 'too long...'
        err[`${path}Error`] = message;
      });
      this.setState(err);
    }
    console.log(response);
  };

  render() {
    const {
      username,
      email,
      password,
      usernameError,
      emailError,
      passwordError,
    } = this.state;

    const errorList = [];
    if (usernameError) {
      errorList.push(usernameError);
    }
    if (emailError) {
      errorList.push(emailError);
    }
    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <Mutation mutation={REGISTER_MUTATION}>
        {register => (
          <Container text>
            <Form>
              <Header as="h2">Register</Header>
              <Form.Field error={!!usernameError}>
                <Input
                  name="username"
                  onChange={this.onChange}
                  value={username}
                  fluid
                  placeholder="Username"
                />
              </Form.Field>

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
              <Button onClick={() => this.onSubmit(register)}>Submit</Button>
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
}
