import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import { GET_TEAM_MEMBERS_QUERY } from '../graphql/team';

const MultiSelectUsers = ({
  value,
  handleChange,
  placeholder,
  teamId,
  currentUserId,
}) => (
  <Query query={GET_TEAM_MEMBERS_QUERY} variables={{ teamId }}>
      {({ loading, data }) => (
        loading ? null : (
          <Dropdown
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            fluid
            multiple
            search
            selection
            options={data.getTeamMembers
              .filter(member => member.id !== currentUserId)
              .map(teamMember => ({ key: teamMember.id, value: teamMember.id, text: teamMember.username }))}
          />
        )
      )}
    </Query>
);

export default MultiSelectUsers;
