import React from 'react';
import {
  Button, Modal, Input, Form, Checkbox,
} from 'semantic-ui-react';
import { withFormik } from 'formik';

import MultiSelectUsers from '../MultiSelectUsers';

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue,
  teamId,
}) => (
  <Modal
      open={open}
      onClose={(e) => {
        resetForm();
        onClose(e);
      }}
    >
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
          {values.public ? null : (
            <Form.Field>
              <MultiSelectUsers
                teamId={teamId}
                placeholder="select members to invite"
              />
            </Form.Field>
          )}
          <Form.Field>
            <Checkbox
              onChange={(e, { checked }) => setFieldValue('public', !checked)}
              value={!values.public}
              label="Private"
              toggle
            />
          </Form.Field>
          <Form.Group widths="equal" className="center">
            <Button
              disabled={isSubmitting}
              onClick={(e) => {
                resetForm();
                onClose(e);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>Create Channel</Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
);

export default withFormik({
  mapPropsToValues: () => ({ public: true, name: '' }),
  handleSubmit: async (values, { props: { onClose, teamId, createChannel }, setSubmitting }) => {
    const response = await createChannel({ variables: { teamId, name: values.name } });
    console.log(response);
    onClose();
    setSubmitting(false);
  },
})(AddChannelModal);
