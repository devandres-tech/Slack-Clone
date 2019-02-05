import React from 'react';
import { Input } from 'semantic-ui-react';

export default ({ channelName }) => (
  <div className="sendMessage">
    <Input fluid placeholder={`Message #${channelName}`} />
  </div>
);
