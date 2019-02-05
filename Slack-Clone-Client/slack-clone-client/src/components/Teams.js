import React from 'react';

const team = ({ id, letter }) => <li key={`team-${id}`}>{letter}</li>;

export default ({ teams }) => (
  <div className="teams">
    <ul>{teams.map(team)}</ul>
  </div>
);
