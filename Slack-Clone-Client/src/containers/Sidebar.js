import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/UI/AddChannelModal';
import InvitePeopleModal from '../components/UI/InvitePeopleModal';
import DirectMessageModal from '../components/UI/DirectMessageModal';
import { ADD_TEAM_MEMBER_MUTATION } from '../graphql/team';


export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddChannelModal: false,
      openInvitePeopleModal: false,
      openDirectMessageModal: false,
    };
  }

  handleAddChanelClick = () => {
    this.setState({ openAddChannelModal: !this.state.openAddChannelModal });
  }

  handleDirectMessageClick = () => {
    this.setState({ openDirectMessageModal: !this.state.openDirectMessageModal });
  }

  handleInvitePeopleClick = () => {
    this.setState({ openInvitePeopleModal: !this.state.openInvitePeopleModal });
  }


  render() {
    const {
      teams, team, username, teamIdx, currentUserId,
    } = this.props;
    const { openAddChannelModal, openInvitePeopleModal, openDirectMessageModal } = this.state;

    return (
      <React.Fragment>
        <Teams teams={teams} />
        <Channels
          onAddChannelClick={this.handleAddChanelClick}
          onInvitePeopleClick={this.handleInvitePeopleClick}
          onDirectMessageClick={this.handleDirectMessageClick}
          teamName={team.name}
          username={username}
          isOwner={team.admin}
          teamId={team.id}
          channels={team.channels}
          users={team.directMessageMembers}
        />
        <AddChannelModal
          teamIndex={teamIdx}
          teamId={team.id}
          currentUserId={currentUserId}
          onClose={this.handleAddChanelClick}
          open={openAddChannelModal}
          key="sidebar-add-channel-modal"
        />
        <Mutation mutation={ADD_TEAM_MEMBER_MUTATION}>
          {addTeamMember => (
            <InvitePeopleModal
              addTeamMember={addTeamMember}
              teamId={team.id}
              onClose={this.handleInvitePeopleClick}
              open={openInvitePeopleModal}
              key="invite-people-modal"
            />
          )}
        </Mutation>

        <DirectMessageModal
          currentUserId={currentUserId}
          teamId={team.id}
          onClose={this.handleDirectMessageClick}
          open={openDirectMessageModal}
          key="direct-message-modal"
        />
      </React.Fragment>
    );
  }
}
