import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';

import { DIRECT_MESSAGE_SUBSCRIPTION } from '../graphql/message';


class DirectMessageContainer extends Component {
  /** Subscribe as soon as components mounts */
  componentDidMount() {
    this.unsubscribe = this.subscribe(this.props.teamId, this.props.userId);
  }

  componentWillReceiveProps({ teamId, userId }) {
    if (this.props.teamId !== teamId || this.props.userId !== userId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(teamId, userId);
    }
  }

  /** Unsubscribe from component when unmounting */
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (teamId, userId) => this.props.subscribeToMore({
    document: DIRECT_MESSAGE_SUBSCRIPTION,
    variables: {
      teamId,
      userId,
    },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData) {
        return prev;
      }

      console.log('return...');

      return {
        ...prev,
        directMessages: [...prev.directMessages, subscriptionData.data.newDirectMessage],
      };
    },
  });


  render() {
    const { data } = this.props;


    return (
      <div className="messages">
        <Comment.Group>
          {data.directMessages.map(message => (

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
  }
}


export default DirectMessageContainer;
