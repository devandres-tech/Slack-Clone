import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { CREATE_MESSAGE_MUTATION } from '../graphql/message';

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
