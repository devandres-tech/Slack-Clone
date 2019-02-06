import React from 'react';
// import Channels from '../components/Channels';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';


const ViewTeam = ({ match: { params } }) => (
  <div className="app-layout">
    <Sidebar currentTeamId={params.teamId} className="channels" />
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

export default ViewTeam;
