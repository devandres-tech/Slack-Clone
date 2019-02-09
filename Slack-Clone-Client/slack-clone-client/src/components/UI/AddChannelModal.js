import React from 'react';
import {
  Button, Modal, Input, Form,
} from 'semantic-ui-react';
import { withFormik } from 'formik';

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <Modal open={open} onClose={onClose}>
      <Modal.Header>Add Channel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              fluid
              placeholder="channel name"
            />
          </Form.Field>
          <Form.Group widths="equal" className="center">
            <Button type="button" onClick={handleSubmit}>Create Channel</Button>
            <Button disabled={isSubmitting} onClick={onClose} type="button">Cancel</Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
);

export default withFormik({
  mapPropsToValues: () => ({ name: '' }),
  handleSubmit: async (values, { props: { onClose, teamId, createChannel }, setSubmitting }) => {
    const response = await createChannel({ variables: { teamId, name: values.name } });
    console.log(response);
    onClose();
    setSubmitting(false);
  },
})(AddChannelModal);
