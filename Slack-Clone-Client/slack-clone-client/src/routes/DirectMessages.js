import React from 'react';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import DirectMessageHeader from '../components/DirectMessageHeader';
import Sidebar from '../containers/Sidebar';
import SendDirectMessage from '../components/SendDirectMessage';
import { GET_ME_QUERY } from '../graphql/team';
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
          <DirectMessageHeader userId={userIdInt} />

          <DirectMessageContainer
            teamId={teamIdInt}
            userId={userIdInt}
          />
          <SendDirectMessage
            receiverId={userIdInt}
            username={userIdInt}
            teamId={teamIdInt}
          />
        </div>
      );
    }}
  </Query>
);

export default ViewTeam;
