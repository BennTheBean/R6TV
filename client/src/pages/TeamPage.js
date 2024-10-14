import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Match from '../components/Match';
import Navbar from "../components/Navbar";
import "./TeamPage.css";

const TeamPage = () => {
  const { tag } = useParams(); //Get the team tag from the URL
  const [teamMatches, setTeamMatches] = useState([]);
  const [teamDetails, setTeamDetails] = useState(null);

  useEffect(() => {
    // Fetch team matches
    const fetchTeamMatches = async () => {
      try {
        const response = await fetch(`/api/team/${tag}/matches`);
        const data = await response.json();
        setTeamMatches(data);
      } catch (error) {
        console.error('Failed to fetch team matches:', error);
      }
    };

    // Fetch team details (e.g. ranking, Elo)
    const fetchTeamDetails = async () => {
      try {
        const response = await fetch(`/api/teams`);
        const teams = await response.json();
        const team = teams.find(t => t.tag === tag);
        setTeamDetails(team);
      } catch (error) {
        console.error('Failed to fetch team details:', error);
      }
    };

    fetchTeamMatches();
    fetchTeamDetails();
  }, [tag]);

  const getImageSrc = useCallback((teamName) => {
    return `/images/teams/${teamName.toLowerCase()}.png`;
  }, []);

  return (
    <div className="TeamPage">
        <Navbar />
        <div className='content-container'>
            <div className='info-container'>
                {teamDetails && (
                    <div className="team-details">
                        <div className='team-header'>
                            <img
                                src={getImageSrc(tag)}
                                alt={teamDetails.name}
                                className="logo"
                            />
                            <div className='header-text'>
                                <h4>Global Ranking: #{teamDetails.rank}</h4>
                                <h2>{teamDetails.full_name}</h2>
                            </div>
                        </div>

                        <h4>Current Elo: {teamDetails.elo}</h4> 
                        <h4>Region: {teamDetails.region}</h4>
                    </div>
                )}
            </div>
                <div className='matches-container'>
                    <h3>Recent Matches</h3>
                    {teamMatches.map((match, index) => {
                        const [team1Score, team2Score] = match.score.split('-').map(Number); // Split the score string and convert to numbers
                        return (
                            <Match
                            key={index}
                            matchDate={match.match_date}
                            team1={match.team1_tag}
                            team2={match.team2_tag}
                            score={{ team1: team1Score, team2: team2Score }}  // Pass score as an object
                            eloChange1={match.final_team1_elo - match.initial_team1_elo}
                            eloChange2={match.final_team2_elo - match.initial_team2_elo}
                            />
                        );
                    })}
                </div>
        </div>
    </div>
  );
};

export default TeamPage;