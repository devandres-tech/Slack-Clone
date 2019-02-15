import React from 'react';
import { Redirect } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { GET_ME_QUERY } from '../graphql/team';
import { CREATE_DIRECT_MESSAGE_MUTATION, GET_DIRECT_MESSAGES } from '../graphql/message';
import DirectMessageContainer from '../containers/DirectMessageContainer';


const ViewTeam = ({ match: { params: { teamId, userId } } }) => (
  <Query query={GET_ME_QUERY} fetchPolicy="network-only">
    {({ loading, data: { me } }) => {
      if (loading) return null;


      // destructor teams from me query
      const { username, teams } = me;

      if (!teams.length) {
        return (<Redirect to="/create-team" />);
      }
      // convert our id's to integers
      const teamIdInt = parseInt(teamId, 10);
      const userIdInt = parseInt(userId, 10);
      // Gets the current team to display, if no teams then display
      // default team "general"
      const teamIdInteger = parseInt(teamId, 10);
      const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
      const currentTeam = teamIdx === -1 ? teams[0] : teams[teamIdx];

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
          <Header channelName="some username" />
          <Query query={GET_DIRECT_MESSAGES} fetchPolicy="network-only" variables={{ teamId: teamIdInt, otherUserId: userIdInt }}>
            {({ loading, data }) => {
              if (loading) return loading;
              return (
                <DirectMessageContainer data={data} />
              );
            }}
          </Query>
          <Mutation mutation={CREATE_DIRECT_MESSAGE_MUTATION}>
            {createDirectMessage => (
              <SendMessage
                onSubmit={async (text) => {
                  const response = await createDirectMessage({
                    variables: { text, receiverId: userIdInt, teamId: teamIdInt },
                  });
                  console.log(response);
                }}
                placeholder={userId}
              />
            )}
          </Mutation>
        </div>
      );
    }}
  </Query>
);

export default ViewTeam;
