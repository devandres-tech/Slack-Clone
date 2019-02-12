import React from 'react';
import { Link } from 'react-router-dom';

const team = ({ id, letter }) => <Link key={`team-${id}`} to={`/view-team/${id}`}><li>{letter}</li></Link>;

export default ({ teams }) => (
  <div className="teams">
    <ul>{teams.map(team)}</ul>
  </div>
);