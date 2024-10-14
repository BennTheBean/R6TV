import React from 'react';
import { useNavigate } from "react-router-dom";
import './Match.css';

const Match = ({ matchDate, team1, team2, score = {}, eloChange1 = 0, eloChange2 = 0 }) => {
  const team1Tag = team1 || 'N/A';
  const team2Tag = team2 || 'N/A';

  const team1Score = parseInt(score.team1 || 0);
  const team2Score = parseInt(score.team2 || 0);
  
  const isTeam1Winner = team1Score > team2Score;
  const isTeam2Winner = team2Score > team1Score;

  const match_date = `${matchDate.split("-")[2]}/${matchDate.split("-")[1]}/${matchDate.split("-")[0]}`

  const navigate = useNavigate();
  const handleTeamClick = (teamTag) => {
    navigate(`/team/${teamTag}`); // Navigate to the team page using the team tag
  };

  return (
    <div className="match-container">
      <div className="match-card">
        <div className={`team-side ${isTeam1Winner ? 'winner-left' : ''}`}>
        <img 
            onClick={() => handleTeamClick(team1Tag)} 
            src={`/images/teams/${team1Tag.toLowerCase()}.png`} 
            alt={team1Tag} 
            className="team-logo"
            style={{ cursor: "pointer" }}
          />
          <div className="team-tag">{team1Tag}</div>
          <div className={`elo-change ${eloChange1 > 0 ? 'increase' : 'decrease'}`}>
            {eloChange1 > 0 ? `+${eloChange1}` : `${eloChange1}`}
          </div>
        </div>
        <div className="match-score">
          <span>{team1Score}</span> - <span>{team2Score}</span>
          <div className="match-date">
            {match_date || 'Unknown Date'}
          </div>
        </div>
        <div className={`team-side ${isTeam2Winner ? 'winner-right' : ''}`}>
          <img 
            onClick={() => handleTeamClick(team2Tag)} 
            src={`/images/teams/${team2Tag.toLowerCase()}.png`} 
            alt={team2Tag} 
            className="team-logo"
            style={{ cursor: "pointer" }}
          />
          <div className="team-tag">{team2Tag}</div>
          <div className={`elo-change ${eloChange2 > 0 ? 'increase' : 'decrease'}`}>
            {eloChange2 > 0 ? `+${eloChange2}` : `${eloChange2}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Match;