import React from 'react';
import {
  Button, Modal, Form,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import { withRouter } from 'react-router-dom';

import { Query } from 'react-apollo';
import { GET_TEAM_MEMBERS_QUERY } from '../../graphql/team';
import MultiSelectUsers from '../MultiSelectUsers';


const DirectMessageModal = ({
  open,
  onClose,
  teamId,
  currentUserId,
  values,
  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue,
}) => (
  <Query query={GET_TEAM_MEMBERS_QUERY} variables={{ teamId }}>
      {({ loading, data }) => (
        <Modal open={open} onClose={onClose}>
          <Modal.Header>Direct Message Users on your Team</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <MultiSelectUsers
                  handleChange={(e, { value }) => setFieldValue('members', value)}
                  value={values.members}
                  teamId={teamId}
                  currentUserId={currentUserId}
                  placeholder="select members to message"
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
                <Button disabled={isSubmitting} onClick={handleSubmit} type="button">Start Messaging</Button>
              </Form.Group>
            </Form>
          </Modal.Content>
        </Modal>
      )}
    </Query>
);

export default withRouter(withFormik({
  mapPropsToValues: () => ({ members: [] }),
  handleSubmit: async (values, { props: { onClose }, setSubmitting }) => {
    console.log('value', values.members);
    onClose();
    setSubmitting(false);
  },
})(DirectMessageModal));
