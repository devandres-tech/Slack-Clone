
import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const channel = ({ id, name }, teamId) => (
  <Link key={`channel-${id}`} to={`/view-team/${teamId}/${id}`}>
    <li>
      <span id="channels__hashtag">#</span>
      {name}
    </li>
  </Link>
);
const displayDmChannel = ({ id, name }, teamId) => (
  <Link key={`user-${id}`} to={`/view-team/${teamId}/${id}`}>
    <li>
      <span id="channels__hashtag">#</span>
      {name}
    </li>
  </Link>
);

export default ({
  teamName,
  username,
  channels,
  directMessageChannels,
  onAddChannelClick,
  teamId,
  onInvitePeopleClick,
  onDirectMessageClick,
  isOwner,
}) => (
  <div className="channels">
      <div className="channels__container">
        <div className="channels__header">
          <h1 className="channels__header-title">{teamName}</h1>
          {username}
        </div>
        <div>
          <ul className="channels__list">
            <li className="channels__heading">
              Channels
              {' '}
              {isOwner && <Icon onClick={onAddChannelClick} name="plus circle" />}
            </li>
            {channels.map(c => channel(c, teamId))}
          </ul>
        </div>
        <div className="direct-messages">
          <ul className="direct-messages__container">
            <li className="direct-messages__heading">
              Direct Messages
              <Icon onClick={onDirectMessageClick} name="plus circle" />
            </li>
            {directMessageChannels.map(dmChannel => displayDmChannel(dmChannel, teamId))}
          </ul>
          {isOwner && (
            <div className="direct-messages__invite-people">
              <a href="#invite-people" onClick={onInvitePeopleClick}>
                <i className="fas fa-plus" />
                Invite People
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
);
