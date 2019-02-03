import React, { Component } from 'react';
import { Container, Header, Input, Button } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';



/** Register our Mutations */
const REGISTER_MUTATION = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;


export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
    };
  }

  /** Set the user input to our state */
  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  /** Submits form and creates a user on the database */
  onSubmit = async (register) => {
    const res = await register({ variables: this.state });
    console.log(res);
  }

  render() { 
    const { username, email, password } = this.state;

    return (
      <Mutation mutation={REGISTER_MUTATION}>
        {(register) => {
          return (
            <div>
              <Container text>
                <Header as="h2">Register</Header>
                <Input
                  name="username"
                  onChange={this.onChange}
                  value={username}
                  fluid
                  placeholder="Username" />
                <Input
                  name="email"
                  onChange={this.onChange}
                  value={email}
                  fluid
                  placeholder="Email" />
                <Input
                  onChange={this.onChange}
                  value={password}
                  fluid
                  name="password"
                  type="password"
                  placeholder="Password" />
                <Button onClick={() => this.onSubmit(register)} >Submit</Button>
              </Container>
            </div>
          )
          
        }}
      </Mutation>
    );
  }
}


