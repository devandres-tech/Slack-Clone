import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';

import { Query } from 'react-apollo';
import { MESSAGE_SUBSCRIPTION, GET_MESSAGES } from '../graphql/message';
import RenderText from '../components/RenderText';


// variable used to hold the value of the subscription
let unsubscribe = null;

// message component that detects the filetype
const Message = ({ message: { url, text, filetype } }) => {
  if (url) {
    if (filetype.startsWith('image/')) {
      console.log('URLLSSSS', url);
      return <img className="file-message" src={url} alt="file uploaded" />;
    } if (filetype === 'text/plain') {
      return <RenderText url={url} />;
    } if (filetype.startsWith('audio/')) {
      return (
        <div>
          <audio controls>
            <source src={url} type={filetype} />
          </audio>
        </div>
      );
    }
  }
  return <Comment.Text>{text}</Comment.Text>;
};

class MessageContainer extends Component {
  state = {
    hasMoreItems: true,
  }

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

  // Make api request when the user reached the top of the page
  handleScroll = (messages, fetchMore) => {
    if (
      this.scroller
      && this.scroller.scrollTop < 3
      && this.state.hasMoreItems
      && messages.length >= 25
    ) {
      fetchMore({
        variables: {
          channelId: this.props.channelId,
          offset: messages.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          if (fetchMoreResult.messages.length < 25) {
            this.setState({ hasMoreItems: false });
          }
          return {
            ...prev,
            messages: [...prev.messages, ...fetchMoreResult.messages],
          };
        },
      });
    }
  }

  render() {
    return (
      <Query
        query={GET_MESSAGES}
        fetchPolicy="network-only"
        variables={{ offset: 0, channelId: this.props.channelId }}
      >
        {({
          loading, error, data: { messages }, subscribeToMore, fetchMore,
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
                if (!subscriptionData) {
                  return prev;
                }
                // if page is at the top set page to the bottom to see the new message
                if (this.scroller && this.scroller.scrollTop < 100) {
                  const heightBeforeRender = this.scroller.scrollHeight;
                  this.scroller.scrollTop = heightBeforeRender;
                }

                return {
                  ...prev,
                  messages: [subscriptionData.data.newChannelMessage, ...prev.messages],
                };
              },
            });
          }
          return (
            <div
              className="messages"
              ref={(scroller) => { this.scroller = scroller; }}
              onScroll={() => this.handleScroll(messages, fetchMore)}
            >
              <Comment.Group>
                {[...messages].reverse().map(message => (
                  <Comment key={`${message.id}-message`}>
                    <Comment.Content>
                      <Comment.Author as="a">{message.user.username}</Comment.Author>
                      <Comment.Metadata>
                        <div>
                          {new Date(parseInt(message.created_at, 10)).toString().slice(0, 24)}
                        </div>

                      </Comment.Metadata>
                      <Message message={message} />
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
