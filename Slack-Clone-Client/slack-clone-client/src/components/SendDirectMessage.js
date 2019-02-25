import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { CREATE_DIRECT_MESSAGE_MUTATION } from '../graphql/message';

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

  handleSubmit = async (e, createDirectMessage) => {
    e.preventDefault();
    if (this.state.message.trim().length > 0) {
      if (!(await createDirectMessage())) {
        alert('Error Occurred');
      }
      this.setState({ message: '' });
    }
  };


  render() {
    const { receiverId, teamId, username } = this.props;
    const { message } = this.state;

    return (
      <Mutation
        variables={{ receiverId, text: message, teamId }}
        mutation={CREATE_DIRECT_MESSAGE_MUTATION}
      >
        {(createDirectMessage, { loading, error }) => {
          if (loading) return 'loading';
          return (
            <form onSubmit={e => this.handleSubmit(e, createDirectMessage)}>
              <div className="sendMessage">
                <Input
                  fluid
                  placeholder={`Message# ${username}`}
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
