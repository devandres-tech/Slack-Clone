import React from 'react';
import {
  Button, Modal, Input, Form,
} from 'semantic-ui-react';
import { withFormik } from 'formik';

import normalizeErrors from '../../normalizeErrors';

const InvitePeopleModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  touched,
  errors,
}) => (
  <Modal open={open} onClose={onClose}>
      <Modal.Header>Add users to your team</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input
              name="email"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              fluid
              placeholder="User's email"
            />
          </Form.Field>
          {touched.email && errors.email ? errors.email[0] : null}
          <Form.Group widths="equal" className="center">
            <Button type="button" onClick={handleSubmit}>Add user</Button>
            <Button disabled={isSubmitting} onClick={onClose} type="button">Cancel</Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
);

export default withFormik({
  mapPropsToValues: () => ({ email: '' }),
  handleSubmit: async (values, { props: { onClose, teamId, addTeamMember }, setSubmitting, setErrors }) => {
    const response = await addTeamMember({ variables: { teamId, email: values.email } });
    const { ok, errors } = response.data.addTeamMember;
    if (ok) {
      onClose();
      setSubmitting(false);
    } else {
      setSubmitting(false);
      const errorsLength = errors.length;
      const filteredErrors = errors.filter(e => e.message !== 'user_id must be unique');
      console.log(filteredErrors);
      if (errorsLength !== filteredErrors.length) {
        filteredErrors.push({
          path: 'email',
          message: 'this user is already part of the team',
        });
      }
      setErrors(normalizeErrors(filteredErrors));
    }
  },
  displayName: 'BasicForm',
})(InvitePeopleModal);
