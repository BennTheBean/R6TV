const sqlite3 = require('sqlite3').verbose();
const math = require('mathjs');

// Helper functions for Glicko-2
function g(phi) {
    return 1 / Math.sqrt(1 + 3 * Math.pow(phi, 2) / Math.pow(Math.PI, 2));
}

function E(mu, mu_j, phi_j) {
    return 1 / (1 + Math.exp(-g(phi_j) * (mu - mu_j)));
}

function calculateGlicko2(team1, team2, score1, score2) {
    const [r1, RD1, sigma1] = team1;
    const [r2, RD2, sigma2] = team2;

    // Convert ratings to Glicko-2 scale
    const mu1 = (r1 - 1500) / 173.7178;
    const phi1 = RD1 / 173.7178;
    const mu2 = (r2 - 1500) / 173.7178;
    const phi2 = RD2 / 173.7178;

    // Determine actual outcome
    const s1 = score1 > score2 ? 1 : score1 < score2 ? 0 : 0.5;

    // Calculate v, delta
    const v = 1 / (Math.pow(g(phi2), 2) * E(mu1, mu2, phi2) * (1 - E(mu1, mu2, phi2)));
    const delta = v * g(phi2) * (s1 - E(mu1, mu2, phi2));

    // Step 6: Update RD (phi)
    const phi1_new = Math.sqrt(phi1 ** 2 + sigma1 ** 2);

    // Update rating and RD
    const phi1_final = 1 / Math.sqrt(1 / (phi1_new ** 2) + 1 / v);
    const mu1_new = mu1 + Math.pow(phi1_final, 2) * g(phi2) * (s1 - E(mu1, mu2, phi2));

    // Convert back to original Glicko scale
    const r1_new = 173.7178 * mu1_new + 1500;
    const RD1_new = 173.7178 * phi1_final;

    return [Math.round(r1_new), Math.round(RD1_new), sigma1];  // Updated rating, RD, volatility
}

// Get all teams
function getTeams(callback) {
    let db = new sqlite3.Database('./league.db');

    db.all("SELECT * FROM teams", [], (err, rows) => {
        if (err) {
            throw err;
        }
        callback(rows);
    });

    db.close();
}

// Get all tournaments
function getTournaments(callback) {
    let db = new sqlite3.Database('./league.db');

    db.all("SELECT * FROM tournaments", [], (err, rows) => {
        if (err) {
            throw err;
        }
        callback(rows);
    });

    db.close();
}

// Get matches for a specific tournament
function getMatches(tournamentId, callback) {
    let db = new sqlite3.Database('./league.db');

    db.all(`
        SELECT m.id, m.team1_tag, m.team2_tag, m.score, m.match_date, 
        m.initial_team1_elo, m.final_team1_elo, m.initial_team2_elo, m.final_team2_elo, 
        t.name AS tournament_name 
        FROM matches m
        JOIN tournaments t ON m.tournament_id = t.id
        WHERE m.tournament_id = ? 
        ORDER BY m.match_date
    `, [tournamentId], (err, rows) => {
        if (err) {
            throw err;
        }
        callback(rows);
    });

    db.close();
}

function getMatchesByTeam(teamTag, callback) {
  let db = new sqlite3.Database('./league.db');
  
  db.all(`
      SELECT * FROM matches 
      WHERE team1_tag = ? OR team2_tag = ? 
      ORDER BY match_date DESC
  `, [teamTag, teamTag], (err, rows) => {
      if (err) {
          console.error(err);
          callback([]);
      } else {
          callback(rows);
      }
  });
}

// Get all matches
function getAllMatches(callback) {
    let db = new sqlite3.Database('./league.db');

    db.all(`
        SELECT m.id, m.team1_tag, m.team2_tag, m.score, m.match_date, 
        m.initial_team1_elo, m.final_team1_elo, m.initial_team2_elo, m.final_team2_elo, 
        t.name AS tournament_name 
        FROM matches m
        JOIN tournaments t ON m.tournament_id = t.id
        ORDER BY m.match_date
    `, [], (err, rows) => {
        if (err) {
            throw err;
        }
        callback(rows);
    });

    db.close();
}

// Add a new tournament
function addTournament(name, start_date, end_date, callback) {
    let db = new sqlite3.Database('./league.db');

    db.run(`
        INSERT INTO tournaments (name, start_date, end_date) 
        VALUES (?, ?, ?)
    `, [name, start_date, end_date], function (err) {
        if (err) {
            callback({ success: false });
        } else {
            callback({ success: true, id: this.lastID });
        }
    });

    db.close();
}

// Function to handle a match update
function addMatch(team1_tag, team2_tag, score, match_date, tournament_id, callback) {
    let db = new sqlite3.Database('./league.db');

    db.get('SELECT elo, rd, volatility FROM teams WHERE tag = ?', [team1_tag], (err, team1) => {
        if (err || !team1) {
            return callback({ success: false });
        }

        db.get('SELECT elo, rd, volatility FROM teams WHERE tag = ?', [team2_tag], (err, team2) => {
            if (err || !team2) {
                return callback({ success: false });
            }

            const [score1, score2] = score.split('-').map(Number);
            const [new_team1_elo, new_team1_rd, new_team1_volatility] = calculateGlicko2(team1, team2, score1, score2);
            const [new_team2_elo, new_team2_rd, new_team2_volatility] = calculateGlicko2(team2, team1, score2, score1);

            // Update both teams
            db.run('UPDATE teams SET elo = ?, rd = ?, volatility = ? WHERE tag = ?',
                   [new_team1_elo, new_team1_rd, new_team1_volatility, team1_tag]);
            db.run('UPDATE teams SET elo = ?, rd = ?, volatility = ? WHERE tag = ?',
                   [new_team2_elo, new_team2_rd, new_team2_volatility, team2_tag]);

            // Insert the match
            db.run(`
                INSERT INTO matches (team1_tag, team2_tag, score, match_date, tournament_id, 
                initial_team1_elo, final_team1_elo, initial_team1_rd, final_team1_rd, initial_team1_volatility,
                initial_team2_elo, final_team2_elo, initial_team2_rd, final_team2_rd, initial_team2_volatility)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [team1_tag, team2_tag, score, match_date, tournament_id,
                 team1.elo, new_team1_elo, team1.rd, new_team1_rd, team1.volatility,
                 team2.elo, new_team2_elo, team2.rd, new_team2_rd, team2.volatility], function(err) {
                    if (err) {
                        callback({ success: false });
                    } else {
                        callback({ success: true, id: this.lastID });
                    }
                });

            db.close();
        });
    });
}

module.exports = {
    getMatchesByTeam,
    getTeams,
    getTournaments,
    getMatches,
    getAllMatches,
    addTournament,
    addMatch
};