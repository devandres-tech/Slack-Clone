import React from 'react';
import { Link } from 'react-router-dom';

const team = ({ id, letter }) => <Link key={`team-${id}`} to={`/view-team/${id}`}><li className="teams__container">{letter}</li></Link>;

export default ({ teams }) => (
  <div className="teams">
    <ul>
      {teams.map(team)}
      <Link className="teams__addChannel" key="add-team" to="/create-team"><i className="fas fa-plus" /></Link>
    </ul>
  </div>
);
