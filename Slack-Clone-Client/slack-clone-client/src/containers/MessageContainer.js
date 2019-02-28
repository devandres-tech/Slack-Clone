import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';

import { Query } from 'react-apollo';
import { MESSAGE_SUBSCRIPTION, GET_MESSAGES } from '../graphql/message';
import FileUpload from '../components/FileUpload';


// used to hold the value of subscription
let unsubscribe = null;

class MessageContainer extends Component {
  componentWillReceiveProps(nextProps, nextContent) {
    if (this.props.channelId !== nextProps.channelId) {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.channelId !== nextProps.channelId;
  }


  componentWillUnmount() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  render() {
    return (

      <Query
        query={GET_MESSAGES}
        fetchPolicy="network-only"
        variables={{ channelId: this.props.channelId }}
      >
        {({
          loading, error, data: { messages }, subscribeToMore,
        }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error ocurred</p> || console.log(error);
          if (!unsubscribe) {
            unsubscribe = subscribeToMore({
              document: MESSAGE_SUBSCRIPTION,
              variables: {
                channelId: this.props.channelId,
              },
              updateQuery: (prev, { subscriptionData }) => {
                console.log('prev', prev);
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
                {messages.map(message => (
                  <Comment key={`${message.id}-message`}>
                    <Comment.Content>
                      <Comment.Author as="a">{message.user.username}</Comment.Author>
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


export default MessageContainer;
