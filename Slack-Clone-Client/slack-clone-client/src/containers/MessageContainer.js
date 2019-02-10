import React from 'react';
import { Query } from 'react-apollo';
import { Comment } from 'semantic-ui-react';

import { GET_MESSAGES } from '../graphql/message';


const MessageContainer = ({ channelId }) => (
  <Query query={GET_MESSAGES} variables={{ channelId }}>
    {({ loading, data }) => {
      if (loading) return 'loading...';
      console.log(data);
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
    }}
  </Query>

);

export default MessageContainer;
