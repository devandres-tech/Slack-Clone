import React from 'react';
import { Redirect } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { GET_ALL_TEAMS } from '../graphql/team';
import { CREATE_MESSAGE_MUTATION, GET_MESSAGES } from '../graphql/message';
import MessageContainer from '../containers/MessageContainer';


const ViewTeam = ({ match: { params: { teamId, channelId } } }) => (
  <Query query={GET_ALL_TEAMS}>
    {({ loading, data: { allTeams, inviteTeams } }) => {
      if (loading) return null;

      // merge owner teams and teams he got invited to
      const allTeamsList = [...allTeams, ...inviteTeams];

      if (!allTeamsList.length) {
        return (<Redirect to="/create-team" />);
      }

      // Gets the current team to display, if no teams then display
      // default team "general"
      const teamIdInteger = parseInt(teamId, 10);
      const teamIdx = teamIdInteger ? findIndex(allTeamsList, ['id', teamIdInteger]) : 0;
      const currentTeam = teamIdx === -1 ? allTeamsList[0] : allTeamsList[teamIdx];

      const channelIdInteger = parseInt(channelId, 10);
      const channelIdx = channelIdInteger ? findIndex(currentTeam.channels, ['id', channelIdInteger]) : 0;
      const currentChannel = channelIdx === -1 ? currentTeam.channels[0] : currentTeam.channels[channelIdx];

      return (
        <div className="app-layout">
          <Sidebar
            teams={allTeamsList.map(t => ({
              id: t.id,
              letter: t.name.charAt(0).toUpperCase(),
            }))}
            team={currentTeam}
            teamIdx={teamIdx}
            className="channels"
          />
          {currentChannel && <Header channelName={currentChannel.name} />}
          {currentChannel && (
            <Query query={GET_MESSAGES} fetchPolicy="network-only" variables={{ channelId: currentChannel.id }}>
              {({
                loading, subscribeToMore, refetch, data,
              }) => {
                console.log();
                if (loading) return 'loaing...';
                return (
                  <MessageContainer
                    channelId={currentChannel.id}
                    data={data}
                    subscribeToMore={subscribeToMore}
                  />
                );
              }}

            </Query>
          )}
          {currentChannel && (
            <Mutation mutation={CREATE_MESSAGE_MUTATION}>
              {createMessage => (
                <SendMessage
                  channelId={currentChannel.id}
                  createMessage={createMessage}
                  channelName={currentChannel.name}
                />
              )}
            </Mutation>
          )}
        </div>
      );
    }}
  </Query>
);

export default ViewTeam;
