import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import {
  Button, Input, Container, Header, Form, Message,
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const CREATE_TEAM_MUTATION = gql`
 mutation createTeam($name: String!) {
  createTeam(name:$name) {
    ok
    team {
      id
    }
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
      name: '',
      errors: {},
    });
  }

  onSubmit = async (createTeam) => {
    const { name } = this;
    let response = null;

    try {
      response = await createTeam({ variables: { name } });
    } catch (err) {
      this.props.history.push('/login');
      return;
    }
    const { ok, errors, team } = response.data.createTeam;

    if (ok) {
      this.props.history.push(`/view-team/${team.id}`);
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
    const { name, errors: { nameError } } = this;

    const errorList = [];
    if (nameError) {
      errorList.push(nameError);
    }

    return (
      <Mutation mutation={CREATE_TEAM_MUTATION}>
        {createTeam => (
          <Container text>
            <Form>
              <Header as="h2">Create Team Name</Header>
              <Form.Field error={!!nameError}>
                <Input
                  name="name"
                  onChange={this.onChange}
                  value={name}
                  fluid
                  placeholder="name"
                />
              </Form.Field>
              <Button onClick={() => this.onSubmit(createTeam)}>Submit</Button>
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
