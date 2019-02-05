
import React from 'react';
// import Teams from './Teams';

const channel = ({ id, name }) => (
  <li key={`channel-${id}`}>
    #
    {name}
  </li>
);
const user = ({ id, name }) => <li key={`user-${id}`}>{name}</li>;

export default ({
  teamName, username, channels, users,
}) => (
    <div className="channels">
      <div>
        {teamName}
        --
        {username}
      </div>
      <div>
        <ul>
          <li>Channels</li>
          {channels.map(channel)}
        </ul>
      </div>
      <div>
        <ul>
          <li>Direct Messages</li>
          {users.map(user)}
        </ul>
      </div>
    </div>
  );
