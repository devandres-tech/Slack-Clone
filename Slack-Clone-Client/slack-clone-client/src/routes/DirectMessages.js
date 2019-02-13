import React from 'react';
import { Redirect } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { GET_ME_QUERY } from '../graphql/team';
import { CREATE_MESSAGE_MUTATION, GET_MESSAGES } from '../graphql/message';
import MessageContainer from '../containers/MessageContainer';


const ViewTeam = ({ match: { params: { teamId, userId } } }) => (
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
          {/* <Header channelName={currentChannel.name} />
          <Query query={GET_MESSAGES} fetchPolicy="network-only" variables={{ channelId: currentChannel.id }}>
            {({
              loading, subscribeToMore, data,
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
          </Query> */}
          <Mutation mutation={CREATE_MESSAGE_MUTATION}>
            {createMessage => (
              <SendMessage
                onSubmit={() => { }}
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
