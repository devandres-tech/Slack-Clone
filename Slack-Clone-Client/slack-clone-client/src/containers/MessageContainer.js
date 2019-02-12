import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';

import { MESSAGE_SUBSCRIPTION } from '../graphql/message';


class MessageContainer extends Component {
  componentDidMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  componentWillReceiveProps({ channelId }) {
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = channelId => this.props.subscribeToMore({
    document: MESSAGE_SUBSCRIPTION,
    variables: {
      channelId,
    },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData) {
        return prev;
      }

      return {
        ...prev,
        messages: [...prev.messages, subscriptionData.data.newChannelMessage],
      };
    },
  });


  render() {
    const { data } = this.props;


    return (
      <div className="messages">
        <Comment.Group>
          {data.messages.map(message => (

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
  }
}


export default MessageContainer;
