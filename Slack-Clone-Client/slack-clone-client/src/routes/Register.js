import React, { Component } from 'react';
import { Container, Header, Input, Button, Message } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';


/** Register our Mutations */
const REGISTER_MUTATION = gql`
mutation register($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    ok
    errors {
      path
      message
    }
  }
}
`;


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
    const response = await register({ variables: { username, email, password } });
    // Get our errors from backend
    const { ok, errors } = response.data.register;
    if (ok) {
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        // err['passwordError'] = 'too long...'
        err[`${path}Error`] = message;
      });
      this.setState(err);
    } 
    console.log(response);
  }

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
        {(register) => {
          return (
            <div>
              <Container text>
                <Header as="h2">Register</Header>
                <Input
                  error={!!usernameError}
                  name="username"
                  onChange={this.onChange}
                  value={username}
                  fluid
                  placeholder="Username"
                />

                <Input
                  error={!!emailError}
                  name="email"
                  onChange={this.onChange}
                  value={email}
                  fluid
                  placeholder="Email"
                />

                <Input
                  error={!!passwordError}
                  onChange={this.onChange}
                  value={password}
                  fluid
                  name="password"
                  type="password"
                  placeholder="Password"
                />

                <Button onClick={() => this.onSubmit(register)}>Submit</Button>

                {usernameError || emailError || passwordError ? (
                  <Message
                    error
                    header="There was some errors with your submission"
                    list={errorList}
                  />
                ) : null}
              </Container>
            </div>
          );
        }}
      </Mutation>
    );
  }
}
