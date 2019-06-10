import React, { Component } from 'react';
import {
  Button, Modal, Form,
} from 'semantic-ui-react';
import { Mutation } from 'react-apollo';

import { GET_OR_CREATE_CHANNEL_MUTATION } from '../../graphql/channel';
import MultiSelectUsers from '../MultiSelectUsers';
import { GET_ME_QUERY } from '../../graphql/team';


class DirectMessageModal extends Component {
  state = {
    members: [],
  }

  setMembersToState = (members) => {
    this.setState({ members });
  }

  handleSubmit = async (getOrCreateChannel) => {
    const { onClose } = this.props;
    await getOrCreateChannel();
    onClose();
  }

  render() {
    const {
      open, onClose, teamId, currentUserId,
    } = this.props;
    const { members } = this.state;

    return (
      <Mutation
        variables={{
          teamId,
          members,
        }}
        mutation={GET_OR_CREATE_CHANNEL_MUTATION}
        refetchQueries={[{ query: GET_ME_QUERY }]}
        errorPolicy="all"
      >
        {getOrCreateChannel => (
          <Modal open={open} onClose={onClose}>
            <Modal.Header>Direct Message Users on your Team</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field>
                  <MultiSelectUsers
                    handleChange={(e, { value }) => this.setMembersToState(value)}
                    value={members}
                    teamId={teamId}
                    currentUserId={currentUserId}
                    placeholder="select members to message"
                  />
                </Form.Field>
                <Form.Group widths="equal" className="center">
                  <Button
                    onClick={(e) => {
                      onClose(e);
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => this.handleSubmit(getOrCreateChannel)} type="button">Start Messaging</Button>
                </Form.Group>
              </Form>
            </Modal.Content>
          </Modal>
        )}
      </Mutation>
    );
  }
}

export default DirectMessageModal;
