import React, { useState, useEffect, useCallback } from 'react';
import "./TournamentPage.css";
import Match from '../components/Match';
import Tournament from '../components/Tournament';
import Navbar from "../components/Navbar";

const TournamentPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [matches, setMatches] = useState([]);

  const loadTournaments = useCallback(async () => {
    try {
      const response = await fetch('/api/tournaments');
      const data = await response.json();
      setTournaments(data);
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
    }
  }, []);

  const loadMatches = useCallback(async (tournamentId) => {
    try {
      const response = await fetch(`/api/tournament/${tournamentId}/matches`);
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    }
  }, []);

  const handleTournamentSelect = (tournament) => {
    setSelectedTournament(tournament); // Set the entire tournament object
    loadMatches(tournament.id); // Pass the tournament ID to loadMatches
  };

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  return (
    <div className="TournamentPage">
      <Navbar />
      <div className="content-container">
        <div className="tournaments-container">
          <h1>Tournaments</h1>
          {tournaments.map((tournament) => (
            <Tournament 
              key={tournament.id} 
              onClick={() => handleTournamentSelect(tournament)} 
              name={tournament.name} 
              startDate={tournament.start_date}
              endDate={tournament.end_date}
            />
          ))}
        </div>
        <div className="matches-container">
          {selectedTournament && (
            <div>
              <h1>{selectedTournament.name} Matches</h1>
              <div>
                {matches.map((match, index) => {
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
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentPage;