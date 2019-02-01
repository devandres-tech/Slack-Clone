export default `

  type Team {
    owner: User!
    member: [User!]!
    channel: [Channel!]!
  }

  type Mutation {
    createTeam(name: String!): Boolean!
  }
`;
