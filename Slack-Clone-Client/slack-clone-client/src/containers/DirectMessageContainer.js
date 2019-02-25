import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';

import { Query } from 'react-apollo';
import { DIRECT_MESSAGE_SUBSCRIPTION, DIRECT_MESSAGES_QUERY } from '../graphql/message';

let unsubscribe = null;

export default class DirectMessageContainer extends Component {
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.teamId !== nextProps.teamId || this.props.userId !== nextProps.userId) {
      if (unsubscribe) {
        unsubscribe = null;
      }
    }
    console.log('teamid: ', this.props.teamId, 'userId:', this.props.userId);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (this.props.teamId !== nextProps.teamId || this.props.userId);
  }

  componentWillUnmount() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  render() {
    const { teamId, userId } = this.props;

    return (
      <Query
        query={DIRECT_MESSAGES_QUERY}
        fetchPolicy="network-only"
        variables={{ teamId, userId }}
      >
        {({
          loading, error, data: { directMessages }, subscribeToMore,
        }) => {
          if (loading) return <p>loading...</p>;
          if (error) return <p>An Error Occurred</p>;
          if (!unsubscribe) {
            unsubscribe = subscribeToMore({
              document: DIRECT_MESSAGE_SUBSCRIPTION,
              variables: { teamId: this.props.teamId, userId: this.props.userId },
              updateQuery: (prev, { subscriptionData }) => {
                console.log('PREV:', prev);
                if (!subscriptionData) {
                  return prev;
                }
                return {
                  ...prev,
                  messages: [...prev.messages, subscriptionData.data.newChannelMessage],
                };
              },
            });
          }
          return (
            <div className="messages">
              <Comment.Group>
                {directMessages.map(message => (

                  <Comment key={`${message.id}-direct-message`}>
                    <Comment.Content>
                      <Comment.Author as="a">{message.sender.username}</Comment.Author>
                      <Comment.Metadata>
                        <div>
                          {new Date(parseInt(message.created_at, 10)).toString().slice(0, 24)}
                        </div>
                      </Comment.Metadata>
                      <Comment.Text>{message.text}</Comment.Text>
                      <Comment.Actions>
                        <Comment.Action>Reply</Comment.Action>
                      </Comment.Actions>
                    </Comment.Content>
                  </Comment>
                ))}
              </Comment.Group>
            </div>
          );
        }}
      </Query>
    );
  }
}
