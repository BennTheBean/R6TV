import React from 'react';
import './Tournament.css';

const Tournament = ({ name, startDate, endDate, onClick }) => {

  const start_date = `${startDate.split("-")[2]}/${startDate.split("-")[1]}/${startDate.split("-")[0]}`
  const end_date = `${endDate.split("-")[2]}/${endDate.split("-")[1]}/${endDate.split("-")[0]}`
  return (
    <div className="tourny-container" onClick={onClick}>
      <div className="tourny-card">
        <img src={`/images/events/${name.split(" ")[0]}.png`} alt={name.split(" ")[0]} className="tournament-logo" />
        <div className="tournament-name">{name}</div>
        <div className="tournament-dates">
          {start_date} - {end_date}
        </div>
      </div>
    </div>
  );
};

export default Tournament;