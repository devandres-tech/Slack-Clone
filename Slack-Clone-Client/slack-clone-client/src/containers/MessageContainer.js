import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { Comment } from 'semantic-ui-react';

import { GET_MESSAGES, MESSAGE_SUBSCRIPTION } from '../graphql/message';
import DisplayMessages from './DisplayMessages';


class MessageContainer extends Component {
  // componentDidMount() {
  //   this.props.subscribeToMore({
  //     document: MESSAGE_SUBSCRIPTION,
  //     variables: { channelId: this.props.channelId },
  //     updateQuery: (prev, { subscriptionData }) => {
  //       console.log('PREV:', prev);
  //       console.log('SUBSCRIPTION DATA:', subscriptionData);
  //       if (!subscriptionData) return prev;

  //       return {
  //         ...prev,
  //         message: [...prev, subscriptionData.data.newChannelMessage],
  //       };
  //     },
  //   });
  // }

  render() {
    const { channelId } = this.props;
    console.log(channelId);

    return (
      <Query query={GET_MESSAGES} variables={{ channelId }}>
        {({ loading, subscribeToMore, data }) => {
          if (loading) return 'loading...';
          // console.log(subscribeToMore);
          return (
            <DisplayMessages
              data={data}
              channelId={channelId}
              subscribeToNewMessages={() => {
                subscribeToMore({
                  document: MESSAGE_SUBSCRIPTION,
                  variables: { channelId: this.props.channelId },
                  updateQuery: (prev, { subscriptionData }) => {
                    console.log('PREV:', prev);
                    console.log('SUBSCRIPTION DATA:', subscriptionData);
                    if (!subscriptionData) return prev;

                    return {
                      ...prev,
                      message: [...prev.messages, subscriptionData.data.newChannelMessage],
                    };
                  },
                });
              }}
            />
          );
        }}
      </Query>
    );
  }
}


export default MessageContainer;
