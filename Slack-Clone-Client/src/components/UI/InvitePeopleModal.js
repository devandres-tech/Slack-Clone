import React, { Component } from 'react';
import {
  Button, Modal, Input, Form, Label,
} from 'semantic-ui-react';
import { Mutation } from 'react-apollo';

import normalizeErrors from '../../normalizeErrors';
import { ADD_TEAM_MEMBER_MUTATION } from '../../graphql/team';


class InvitePeopleModal extends Component {
  state = {
    email: '',
    errors: '',
  }

  onInputChange = (e) => {
    const { value } = e.target;
    const { name } = e.target;
    this.setState({
      [name]: value,
    });
    this.setState({ errors: '' });
  }

  resetState = () => {
    const { onClose } = this.props;
    this.setState({ email: '', errors: '' });
    onClose();
  }

  handleSubmit = async (addTeamMember) => {
    this.setState({ errors: '' });
    const { email } = this.state;
    const { teamId, onClose } = this.props;
    const response = await addTeamMember({ variables: { teamId, email } });
    const { ok, errors } = response.data.addTeamMember;
    if (ok) {
      onClose();
    } else {
      const errorsLength = errors.length;
      const filteredErrors = errors.filter(e => e.message !== 'user_id must be unique');
      if (errorsLength !== filteredErrors.length) {
        filteredErrors.push({
          path: 'email',
          message: 'this user is already part of the team',
        });
      }
      this.setState({ errors: normalizeErrors(filteredErrors) });
    }
  }


  render() {
    const { open, onClose } = this.props;
    const { email, errors } = this.state;

    return (
      <Mutation
        mutation={ADD_TEAM_MEMBER_MUTATION}
      >
        {addTeamMember => (
          <Modal open={open} onClose={onClose}>
            <Modal.Header>Add users to your team</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field>
                  <Input
                    name="email"
                    value={email}
                    onChange={this.onInputChange}
                    fluid
                    placeholder="User's email"
                  />
                </Form.Field>
                {errors.email && email.length > 0 ? (
                  <Form.Field>
                    <Label basic color="red" pointing>
                      {errors.email[0]}
                    </Label>
                  </Form.Field>
                ) : null}
                <Form.Group widths="equal" className="center">
                  <Button type="button" onClick={() => this.handleSubmit(addTeamMember)}>Add user</Button>
                  <Button onClick={() => this.resetState()} type="button">Cancel</Button>
                </Form.Group>
              </Form>
            </Modal.Content>
          </Modal>
        )}
      </Mutation>
    );
  }
}

export default InvitePeopleModal;
