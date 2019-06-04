import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Input } from 'semantic-ui-react';
import { CREATE_DIRECT_MESSAGE_MUTATION } from '../graphql/message';
import { GET_USER_QUERY } from '../graphql/user';

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
    const { receiverId, teamId } = this.props;
    const { message } = this.state;

    return (
      <Query
        query={GET_USER_QUERY}
        variables={{ userId: receiverId }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading....</p>;
          return (
            <Mutation
              variables={{ receiverId, text: message, teamId }}
              mutation={CREATE_DIRECT_MESSAGE_MUTATION}
            >
              {(createDirectMessage, { loading, error }) => {
                if (loading) return '';
                return (
                  <form onSubmit={e => this.handleSubmit(e, createDirectMessage)}>
                    <div className="sendMessage">
                      <Input
                        fluid
                        placeholder={`Message# ${data.getUser.username}`}
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
        }}
      </Query>
    );
  }
}
