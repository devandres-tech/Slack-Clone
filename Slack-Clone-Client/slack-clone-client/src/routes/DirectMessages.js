import React from 'react';
import { Redirect } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { GET_ME_QUERY, GET_USER_QUERY } from '../graphql/team';
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
        <Query query={GET_USER_QUERY} variables={{ userId: userIdInt }}>
          {({ loading, data: { getUser } }) => {
            if (loading) return 'loading';
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
                <Header channelName={getUser.username} />
                <Query query={GET_DIRECT_MESSAGES} fetchPolicy="network-only" variables={{ teamId: teamIdInt, otherUserId: userIdInt }}>
                  {({ loading, data, subscribeToMore }) => {
                    if (loading) return loading;
                    return (
                      <DirectMessageContainer
                        teamId={teamIdInt}
                        userId={userIdInt}
                        subscribeToMore={subscribeToMore}
                        data={data}
                      />
                    );
                  }}
                </Query>
                <Mutation
                  mutation={CREATE_DIRECT_MESSAGE_MUTATION}
                  update={(cache) => {
                    const response = cache.readQuery({ query: GET_ME_QUERY });
                    const memberToUpdate = response.me.teams[teamIdx].directMessageMembers;
                    const notAlreadyThere = memberToUpdate.every(member => member.id !== userIdInt);
                    if (notAlreadyThere) {
                      cache.writeQuery({
                        query: GET_ME_QUERY,
                        data: memberToUpdate.push({
                          id: userIdInt,
                          username: getUser.username,
                          __typename: 'User',
                        }),
                      });
                    }
                  }}
                >
                  {createDirectMessage => (
                    <SendMessage
                      onSubmit={async (text) => {
                        await createDirectMessage({
                          variables: { text, receiverId: userIdInt, teamId: teamIdInt },
                        });
                      }}
                      placeholder={getUser.username}
                    />
                  )}
                </Mutation>
              </div>
            );
          }}
        </Query>
      );
    }}
  </Query>
);

export default ViewTeam;
