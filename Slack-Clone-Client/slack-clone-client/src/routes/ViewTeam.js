import React from 'react';
import { Query } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { GET_ALL_TEAMS } from '../graphql/team';


const ViewTeam = ({ match: { params: { teamId, channelId } } }) => (
  <Query query={GET_ALL_TEAMS}>
    {({ loading, data: { allTeams } }) => {
      if (loading) return null;

      const teamIdx = teamId ? findIndex(allTeams, ['id', parseInt(teamId, 10)]) : 0;
      const currentTeam = allTeams[teamIdx];
      const channelIdx = channelId ? findIndex(currentTeam.channels, ['id', parseInt(channelId, 10)]) : 0;
      const currentChannel = currentTeam.channels[channelIdx];

      return (
        <div className="app-layout">
          <Sidebar
            teams={allTeams.map(t => ({
              id: t.id,
              letter: t.name.charAt(0).toUpperCase(),
            }))}
            team={currentTeam}
            teamIdx={teamIdx}
            className="channels"
          />
          <Header channelName={currentChannel.name} />
          <Messages channelId={currentChannel.id}>
            <ul>
              <li />
              <li />
            </ul>
          </Messages>
          <SendMessage channelName={currentChannel.name} />
        </div>
      );
    }}
  </Query>
);

export default ViewTeam;
