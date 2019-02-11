import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';
import { MESSAGE_SUBSCRIPTION } from '../graphql/message';

class DisplayMessages extends Component {
  componentWillMount() {
    this.props.subscribeToNewMessages();
    // this.props.subscribeToMore({
    //   document: MESSAGE_SUBSCRIPTION,
    //   variables: { channelId: this.props.channelId },
    //   updateQuery: (prev, { subscriptionData }) => {
    //     console.log('PREV:', prev);
    //     console.log('SUBSCRIPTION DATA:', subscriptionData);
    //     if (!subscriptionData) return prev;

    //     return {
    //       ...prev,
    //       message: [...prev.messages, subscriptionData.data.newChannelMessage],
    //     };
    //   },
    // });
  }

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

export default DisplayMessages;

// export default ({ data, subscribeToMore }) => (
//   <div className="messages">
//     <Comment.Group>
//       {data.messages.map(message => (

//         <Comment key={`${message.id}-message`}>
//           <Comment.Content>
//             <Comment.Author as="a">{message.user.username}</Comment.Author>
//             <Comment.Metadata>
//               <div>
//                 {new Date(parseInt(message.created_at, 10)).toString().slice(0, 24)}
//               </div>
//             </Comment.Metadata>
//             <Comment.Text>{message.text}</Comment.Text>
//             <Comment.Actions>
//               <Comment.Action>Reply</Comment.Action>
//             </Comment.Actions>
//           </Comment.Content>
//         </Comment>
//       ))}
//     </Comment.Group>
//   </div>
// );
