import React, { Component } from 'react';
import {
  Button, Modal, Input, Form, Checkbox,
} from 'semantic-ui-react';
import { Mutation } from 'react-apollo';

import MultiSelectUsers from '../MultiSelectUsers';
import { CREATE_CHANNEL_MUTATION } from '../../graphql/channel';
import { GET_ME_QUERY } from '../../graphql/team';

class AddChannelModal extends Component {
  state = {
    channelName: '',
    isPublic: true,
    members: [],
  }

  onInputChange = (e) => {
    const { value } = e.target;
    const { name } = e.target;
    this.setState({
      [name]: value,
    });
  }

  setMembersToState = (members) => {
    this.setState({ members });
  }

  handleSubmit = async (createChannel) => {
    const { onClose } = this.props;
    await createChannel();
    // reset sate form
    this.setState({
      channelName: '',
      isPublic: true,
      members: [],
    });
    onClose();
  }

  render() {
    const {
      open, onClose, currentUserId, teamId,
    } = this.props;

    const { channelName, isPublic, members } = this.state;

    return (
      <Mutation
        mutation={CREATE_CHANNEL_MUTATION}
        variables={{
          teamId,
          name: channelName,
          public: isPublic,
          members,
        }}
        refetchQueries={[{ query: GET_ME_QUERY }]}
        errorPolicy="all"
      >
        {createChannel => (
          <Modal
            open={open}
            onClose={(e) => { onClose(e); }}
          >
            <Modal.Header>Add Channel</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field>
                  <Input
                    name="channelName"
                    value={channelName}
                    onChange={this.onInputChange}
                    fluid
                    placeholder="channel name"
                  />
                </Form.Field>
                {isPublic ? null : (
                  <Form.Field>
                    <MultiSelectUsers
                      handleChange={(e, { value }) => this.setMembersToState(value)}
                      value={members}
                      teamId={teamId}
                      currentUserId={currentUserId}
                      placeholder="select members to invite"
                    />
                  </Form.Field>
                )}
                <Form.Field>
                  <Checkbox
                    onChange={(e, { checked }) => this.setState({ isPublic: !checked })}
                    checked={!isPublic}
                    label="Private"
                    toggle
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
                  <Button type="button" onClick={() => this.handleSubmit(createChannel)}>Create Channel</Button>
                </Form.Group>
              </Form>
            </Modal.Content>
          </Modal>

        )}
      </Mutation>
    );
  }
}

export default AddChannelModal;
