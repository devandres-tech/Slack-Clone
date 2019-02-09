
import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const channel = ({ id, name }, teamId) => (
  <Link key={`channel-${id}`} to={`/view-team/${teamId}/${id}`}>
    <li>
      #
      {name}
    </li>
  </Link>
);
const user = ({ id, name }) => <li key={`user-${id}`}>{name}</li>;

export default ({
  teamName, username, channels, users, onAddChannelClick, teamId, onInvitePeopleClick, isOwner,
}) => (
    <div className="channels">
      <div>
        {teamName}
        --
        {username}
      </div>
      <div>
        <ul>
          <li>
            Channels
            {' '}
            {isOwner && <Icon onClick={onAddChannelClick} name="plus circle" />}
          </li>
          {channels.map(c => channel(c, teamId))}
        </ul>
      </div>
      <div>
        <ul>
          <li>Direct Messages</li>
          {users.map(user)}
        </ul>
      </div>
      {isOwner && (
        <div>
          <a href="#invite-people" onClick={onInvitePeopleClick}>
            + Invite People
          </a>
        </div>
      )}
    </div>
  );
