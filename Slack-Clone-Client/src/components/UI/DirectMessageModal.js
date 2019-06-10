import React, { Component } from 'react';
import {
  Button, Modal, Form,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import { GET_OR_CREATE_CHANNEL_MUTATION } from '../../graphql/channel';
import MultiSelectUsers from '../MultiSelectUsers';


class DirectMessageModal extends Component {
  state = {
    members: [],
  }

  setMembersToState = (members) => {
    this.setState({ members });
  }

  handleSubmit = async (getOrCreateChannel) => {
    const { onClose } = this.props;
    const response = await getOrCreateChannel();
    console.log('response', response);
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


// const DirectMessageModal = ({
//   open,
//   onClose,
//   teamId,
//   currentUserId,
//   values,
//   handleSubmit,
//   isSubmitting,
//   resetForm,
//   setFieldValue,
// }) => (

//   <Modal open={open} onClose={onClose}>
//       <Modal.Header>Direct Message Users on your Team</Modal.Header>
//       <Modal.Content>
//         <Form>
//           <Form.Field>
//             <MultiSelectUsers
//               handleChange={(e, { value }) => setFieldValue('members', value)}
//               value={values.members}
//               teamId={teamId}
//               currentUserId={currentUserId}
//               placeholder="select members to message"
//             />
//           </Form.Field>
//           <Form.Group widths="equal" className="center">
//             <Button
//               disabled={isSubmitting}
//               onClick={(e) => {
//                 resetForm();
//                 onClose(e);
//               }}
//               type="button"
//             >
//               Cancel
//             </Button>
//             <Button disabled={isSubmitting} onClick={handleSubmit} type="button">Start Messaging</Button>
//           </Form.Group>
//         </Form>
//       </Modal.Content>
//     </Modal>
// );

// export default withRouter(withFormik({
//   mapPropsToValues: () => ({ members: [] }),
//   handleSubmit: async (values, { props: { onClose }, setSubmitting }) => {
//     console.log('value', values.members);
//     onClose();
//     setSubmitting(false);
//   },
// })(DirectMessageModal));
