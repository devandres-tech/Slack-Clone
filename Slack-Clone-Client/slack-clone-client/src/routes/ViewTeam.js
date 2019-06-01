import React from 'react';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { GET_ME_QUERY } from '../graphql/team';
import MessageContainer from '../containers/MessageContainer';


const ViewTeam = ({ match: { params: { teamId, channelId } } }) => (
  <Query query={GET_ME_QUERY} fetchPolicy="network-only">
    {({ loading, data: { me } }) => {
      if (loading) return null;


      // destructor teams from me query
      const { username, teams } = me;

      if (!teams.length) {
        return (<Redirect to="/create-team" />);
      }

      // Gets the current team to display, if no teams then display
      // default team "general"
      const teamIdInteger = parseInt(teamId, 10);
      const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
      const currentTeam = teamIdx === -1 ? teams[0] : teams[teamIdx];

      const channelIdInteger = parseInt(channelId, 10);
      const channelIdx = channelIdInteger ? findIndex(currentTeam.channels, ['id', channelIdInteger]) : 0;
      const currentChannel = channelIdx === -1 ? currentTeam.channels[0] : currentTeam.channels[channelIdx];

      return (
        <div className="app-layout">
          <Sidebar
            teams={teams.map(t => ({
              id: t.id,
              letter: t.name.charAt(0).toUpperCase(),
            }))}
            team={currentTeam}
            teamIdx={teamIdx}
            username={username}
            className="channels"
          />
          {currentChannel ? (
            <>
              <Header channelName={currentChannel.name} />
              <MessageContainer
                channelId={currentChannel.id}
              />
              <SendMessage
                channelId={currentChannel.id}
                channelName={currentChannel.name}
              />
            </>
          ) : null}
        </div>
      );
    }}
  </Query>
);

export default ViewTeam;
