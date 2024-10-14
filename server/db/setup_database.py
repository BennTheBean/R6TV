import sqlite3

def create_tables():
    conn = sqlite3.connect('league.db')
    c = conn.cursor()

    # Create teams table
    c.execute('''
        CREATE TABLE IF NOT EXISTS teams (
            tag TEXT PRIMARY KEY NOT NULL,
            full_name TEXT NOT NULL,
            region TEXT NOT NULL,
            elo INTEGER NOT NULL
        )
    ''')

    # Create tournaments table
    c.execute('''
        CREATE TABLE IF NOT EXISTS tournaments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            start_date TEXT,
            end_date TEXT
        )
    ''')

    # Create matches table
    c.execute('''
        CREATE TABLE IF NOT EXISTS matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team1_tag TEXT NOT NULL,
            team2_tag TEXT NOT NULL,
            score TEXT,
            match_date TEXT,
            tournament_id INTEGER,
            initial_team1_elo INTEGER,
            final_team1_elo INTEGER,
            initial_team2_elo INTEGER,
            final_team2_elo INTEGER,
            FOREIGN KEY (team1_tag) REFERENCES teams (tag),
            FOREIGN KEY (team2_tag) REFERENCES teams (tag),
            FOREIGN KEY (tournament_id) REFERENCES tournaments (id)
        )
    ''')

    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_tables()