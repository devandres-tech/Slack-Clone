
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
const user = ({ id, username }, teamId) => (
  <Link key={`user-${id}`} to={`/view-team/user/${teamId}/${id}`}>
    <li>
      #
      {username}
    </li>
  </Link>
);

export default ({
  teamName,
  username,
  channels,
  users,
  onAddChannelClick,
  teamId,
  onInvitePeopleClick,
  onDirectMessageClick,
  isOwner,
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
          <li>
            Direct Messages
            <Icon onClick={onDirectMessageClick} name="plus circle" />
          </li>
          {users.map(u => user(u, teamId))}
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
