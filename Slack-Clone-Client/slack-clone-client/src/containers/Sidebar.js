import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';


const GET_ALL_TEAMS = gql`
{
  allTeams {
    id
    name
    channels {
      id
      name
    }
  }
}
`;

// const Sidebar = ({ data: { loading, allTeams }, currentTeamId }) => {
//   if (loading) {
//     return null;
//   }

//   const teamIdx = _.findIndex(allTeams, ['id', currentTeamId]);
//   const team = allTeams[teamIdx];
//   let username = '';
//   try {
//     const token = localStorage.getItem('token');
//     const { user } = decode(token);
//     username = user.username;
//   } catch (err) { }

//   return (
//     <React.Fragment>
//       <Teams teams={allTeams.map(t => ({
//         id: t.id,
//         letter: t.name.chatAt(0).toUpperCase(),
//       }))}
//       />
//       <Channels
//         teamName={team.name}
//         username={username}
//         channels={team.channels}
//         users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
//       />
//     </React.Fragment>
//   );
// };

const Sidebar = ({ currentTeamId }) => (
  <Query query={GET_ALL_TEAMS}>
    {({ loading, data: { allTeams } }) => {
      if (loading) {
        return null;
      }

      const teamIdx = _.findIndex(allTeams, ['id', currentTeamId]);
      const team = allTeams[teamIdx];
      let username = '';
      try {
        const token = localStorage.getItem('token');
        const { user } = decode(token);
        username = user.username;
      } catch (err) { }

      return (
        <React.Fragment>
          <Teams teams={allTeams.map(t => ({
            id: t.id,
            letter: t.name.charAt(0).toUpperCase(),
          }))}
          />
          <Channels
            teamName={team.name}
            username={username}
            channels={team.channels}
            users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
          />
        </React.Fragment>
      );
    }}
  </Query>
);

export default Sidebar;
