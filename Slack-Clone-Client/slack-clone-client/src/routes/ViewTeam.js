import React from 'react';
// import Channels from '../components/Channels';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';


export default () => (
  <div className="app-layout">
    {/* <Channels
      teamName="Team name"
      username="Username"
      channels={[{ id: 1, name: 'general' }, { id: 2, name: 'random' }]}
      users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
    /> */}
    <Sidebar currentTeamId={7} className="channels" />
    <Header channelName="general" />
    <Messages>
      <ul>
        <li />
        <li />
      </ul>
    </Messages>
    <SendMessage channelName="general" />
  </div>
);
