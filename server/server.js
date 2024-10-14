const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const elo = require('./elo.js');

app.use(bodyParser.json());

// Get all teams
app.get('/api/teams', (req, res) => {
    elo.getTeams((teams) => {
      const sortedTeams = teams.sort((a, b) => b.elo - a.elo); // Sort teams by Elo (descending)
      const rankedTeams = sortedTeams.map((team, index) => ({
        ...team,
        rank: index + 1 // Rank starts from 1
      }));
  
      res.json(rankedTeams);
    });
});

//Get all tournaments
app.get('/api/tournaments', (req, res) => {
  elo.getTournaments((tournaments) => {
      const sortedTournaments = tournaments.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      res.json(sortedTournaments);
  });
});

// Get matches for a specific tournament
app.get('/api/tournament/:id/matches', (req, res) => {
  const tournamentId = req.params.id;
  elo.getMatches(tournamentId, (matches) => {
      const sortedMatches = matches.sort((a, b) => new Date(b.match_date) - new Date(a.match_date));
      res.json(sortedMatches);
  });
});

// Get all matches
app.get('/api/matches', (req, res) => {
  elo.getAllMatches((matches) => {
      const sortedMatches = matches.sort((a, b) => new Date(b.match_date) - new Date(a.match_date));
      res.json(sortedMatches);
  });
});

// Get all matches played by a specific team using their tag
app.get('/api/team/:tag/matches', (req, res) => {
  const teamTag = req.params.tag;
  elo.getMatchesByTeam(teamTag, (matches) => {
      res.json(matches);
  });
});

// Add a new tournament
app.post('/api/addTournament', (req, res) => {
    const { name, start_date, end_date } = req.body;
    elo.addTournament(name, start_date, end_date, (result) => {
        if (result.success) {
            res.status(201).json({ message: 'Tournament added successfully', id: result.id });
        } else {
            res.status(500).json({ message: 'Error adding tournament' });
        }
    });
});

// Add a new match
app.post('/api/addMatch', (req, res) => {
    const { team1_tag, team2_tag, score, match_date, tournament_id } = req.body;
    elo.addMatch(team1_tag, team2_tag, score, match_date, tournament_id, (result) => {
        if (result.success) {
            res.status(201).json({ message: 'Match added successfully', id: result.id });
        } else {
            res.status(500).json({ message: 'Error adding match' });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});