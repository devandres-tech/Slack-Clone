export default `

  type Team {
    owner: User!
    member: [User!]!
    channel: [Channel!]!
  }

  type CreateTeamResponse {
    ok: Boolean!
    errors: [Error!]
  }

  type Mutation {
    createTeam(name: String!): CreateTeamResponse!
  }
`;
