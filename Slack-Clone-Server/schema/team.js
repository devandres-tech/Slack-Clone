export default `

  type Team {
    id: Int!
    owner: User!
    name: String!
    member: [User!]!
    channels: [Channel!]!
  }

  type CreateTeamResponse {
    ok: Boolean!
    errors: [Error!]
  }

  type Query {
    allTeams: [Team!]!
  }

  type Mutation {
    createTeam(name: String!): CreateTeamResponse!
  }
`;
