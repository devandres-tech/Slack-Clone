import React from 'react';
import {
  Button, Header, Modal, Input, Form,
} from 'semantic-ui-react';

const AddChannelModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input fluid placeholder="channel name" />
        </Form.Field>
        <Form.Group widths="equal" className="center">
          <Button>Create Channel</Button>
          <Button>Channel</Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

export default AddChannelModal;
