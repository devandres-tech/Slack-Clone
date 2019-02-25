import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { CREATE_MESSAGE_MUTATION } from '../graphql/message';


// const ENTER_KEY = 13;
// const SendMessage = ({
//   channelName,
//   values,
//   handleChange,
//   handleBlur,
//   handleSubmit,
//   isSubmitting,
// }) => (
//   <div className="sendMessage">
//       <Input
//         onKeyDown={(e) => {
//           if (e.keyCode === ENTER_KEY && !isSubmitting) {
//             handleSubmit(e);
//           }
//         }}
//         value={values.message}
//         fluid
//         name="message"
//         onChange={handleChange}
//         onBlur={handleBlur}
//         placeholder={`Message #${channelName}`}
//       />
//     </div>
// );

// export default withFormik({
//   mapPropsToValues: () => ({ message: '' }),
//   handleSubmit: async (values, { props: { onSubmit }, setSubmitting, resetForm }) => {
//     if (!values.message || !values.message.trim()) {
//       setSubmitting(false);
//       return;
//     }
//     await onSubmit(values.message);
//     resetForm(false);
//   },
// })(SendMessage);

export default class sendMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  messageOnChangeHandler = (e) => {
    this.setState({ message: e.target.value });
  }

  handleSubmit = async (e, createMessage) => {
    e.preventDefault();
    if (this.state.message.trim().length > 0) {
      if (!(await createMessage())) {
        alert('Error Occurred');
      }
      this.setState({ message: '' });
    }
  };


  render() {
    const { channelId, channelName } = this.props;
    const { message } = this.state;

    return (
      <Mutation
        variables={{ channelId, text: message }}
        mutation={CREATE_MESSAGE_MUTATION}
      >
        {(createMessage, { loading, error }) => {
          if (loading) return 'error';
          return (
            <form onSubmit={e => this.handleSubmit(e, createMessage)}>
              <div className="sendMessage">
                <Input
                  fluid
                  placeholder={`Message# ${channelName}`}
                  onChange={this.messageOnChangeHandler}
                  value={message}
                  disabled={loading}
                />
              </div>
            </form>
          );
        }}
      </Mutation>
    );
  }
}
