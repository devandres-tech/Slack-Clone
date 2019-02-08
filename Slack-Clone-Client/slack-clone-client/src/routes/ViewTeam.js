import React from 'react';
import { Redirect } from 'react-router-dom';
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

      if (!allTeams.length) {
        return (<Redirect to="/create-team" />);
      }

      const teamIdInteger = parseInt(teamId, 10);
      const teamIdx = teamIdInteger ? findIndex(allTeams, ['id', teamIdInteger]) : 0;
      const currentTeam = allTeams[teamIdx];

      const channelIdInteger = parseInt(channelId, 10);
      const channelIdx = channelIdInteger ? findIndex(currentTeam.channels, ['id', channelIdInteger]) : 0;
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
          {currentChannel && <Header channelName={currentChannel.name} />}
          {currentChannel && (
            <Messages channelId={currentChannel.id}>
              <ul>
                <li />
                <li />
              </ul>
            </Messages>
          )}
          {currentChannel && <SendMessage channelName={currentChannel.name} />}
        </div>
      );
    }}
  </Query>
);

export default ViewTeam;
