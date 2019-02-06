import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/UI/AddChannelModal';
import { GET_ALL_TEAMS } from '../graphql/team';


const CREATE_CHANNEL_MUTATION = gql`
  mutation createChannel($teamId: Int!, $name: String!) {
  createChannel(teamId:$teamId, name:$name) {
    ok
    channel {
      id
      name
    }
  }
}
`;


export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddChannelModal: false,
    };
  }

  handleAddChanelClick = () => {
    this.setState({ openAddChannelModal: true });
  }

  handleCloseAddChannelModal = () => {
    this.setState({ openAddChannelModal: false });
  }


  render() {
    const { currentTeamId } = this.props;
    const { openAddChannelModal } = this.state;

    return (
      <Query query={GET_ALL_TEAMS}>
        {({ loading, data: { allTeams } }) => {
          if (loading) {
            return null;
          }
          // Get current team
          const teamIdx = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;
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
                onAddChannelClick={this.handleAddChanelClick}
                teamName={team.name}
                username={username}
                channels={team.channels}
                users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
              />
              <Mutation
                mutation={CREATE_CHANNEL_MUTATION}
                update={(cache, { data: { createChannel } }) => {
                  const { ok, channel } = createChannel;
                  if (!ok) {
                    return;
                  }
                  const response = cache.readQuery({ query: GET_ALL_TEAMS });
                  const channelToUpdate = response.allTeams[teamIdx].channels;

                  cache.writeQuery({
                    query: GET_ALL_TEAMS,
                    data: channelToUpdate.push(channel),
                  });
                }}
              >
                {createChannel => (
                  <AddChannelModal
                    createChannel={createChannel}
                    teamId={team.id}
                    onClose={this.handleCloseAddChannelModal}
                    open={openAddChannelModal}
                    key="sidebar-add-channel-modal"
                  />
                )}
              </Mutation>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}
