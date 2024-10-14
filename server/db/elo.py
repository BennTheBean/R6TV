import sqlite3
import os

def calculate_elo_change(team1_elo, team2_elo, team1_score, team2_score, k=32):
    expected_team1 = 1 / (1 + 10 ** ((team2_elo - team1_elo) / 400))
    expected_team2 = 1 / (1 + 10 ** ((team1_elo - team2_elo) / 400))

    if team1_score > team2_score:
        team1_result = 1
        team2_result = 0
    elif team1_score < team2_score:
        team1_result = 0
        team2_result = 1
    else:
        team1_result = 0.5
        team2_result = 0.5

    new_team1_elo = team1_elo + k * (team1_result - expected_team1)
    new_team2_elo = team2_elo + k * (team2_result - expected_team2)

    return round(new_team1_elo), round(new_team2_elo)

def process_match(c, team1_tag, team2_tag, score, match_date, tournament_id):
    # Fetch team elos
    c.execute('SELECT elo FROM teams WHERE tag = ?', (team1_tag,))
    team1_elo = c.fetchone()[0]

    c.execute('SELECT elo FROM teams WHERE tag = ?', (team2_tag,))
    team2_elo = c.fetchone()[0]

    team1_score, team2_score = map(int, score.split('-'))

    # Calculate Elo changes
    new_team1_elo, new_team2_elo = calculate_elo_change(team1_elo, team2_elo, team1_score, team2_score)

    # Update Elo for both teams
    c.execute('UPDATE teams SET elo = ? WHERE tag = ?', (new_team1_elo, team1_tag))
    c.execute('UPDATE teams SET elo = ? WHERE tag = ?', (new_team2_elo, team2_tag))

    # Insert match result
    c.execute('''
        INSERT INTO matches (team1_tag, team2_tag, score, match_date, tournament_id, 
        initial_team1_elo, final_team1_elo, initial_team2_elo, final_team2_elo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (team1_tag, team2_tag, score, match_date, tournament_id, team1_elo, new_team1_elo, team2_elo, new_team2_elo))


def process_matches_from_file(c, file_name):
    with open(file_name, 'r') as f:
        tournament_dates = f.readline().strip()  # Read start and end date
        start_date, end_date = tournament_dates.split(',')

        tournament_name = os.path.basename(file_name).replace('.txt', '').replace('-', ' ') #Formats the tournament name

        # Insert tournament into the database
        c.execute('''
            INSERT INTO tournaments (name, start_date, end_date)
            VALUES (?, ?, ?)
        ''', (tournament_name, start_date, end_date))
        tournament_id = c.lastrowid

        # Process each match line in the file
        for line in f:
            team1_tag, team2_tag, score, match_date = line.strip().split(',')
            process_match(c, team1_tag, team2_tag, score, match_date, tournament_id)

def main():
    conn = sqlite3.connect('league.db', timeout=10)  # Increase timeout
    c = conn.cursor()

    match_files = [
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\NA-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EU-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\BR-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\KR-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\JPN-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\ASIA-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\MENA-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\LATAM-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\OCE-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\NA-LCQ-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EU-LCQ-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\BR-LCQ-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\KR-LCQ-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\JPN-LCQ-Stage-1.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\Major-Manchester.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EWC\\EWC-NA-CQ.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EWC\\EWC-EU-CQ.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EWC\\EWC-BR-CQ.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EWC\\EWC-KR-CQ.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EWC\\EWC-JPN-CQ.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EWC\\EWC-ASIA-CQ.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EWC\\EWC-MENA-CQ.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EWC\\EWC-LATAM-CQ.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EWC\\EWC-OCE-CQ.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EWC\\EWC-2024.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\NA-Stage-2.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\EU-Stage-2.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\BR-Stage-2.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\KR-Stage-2.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\JPN-Stage-2.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\ASIA-Stage-2.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\MENA-Stage-2.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\LATAM-Stage-2.txt',
        'C:\\Coding\\ReactProjects\\br6-elo-ranking\\server\\matches\\OCE-Stage-2.txt'
    ]

    # Process all match files with the same connection
    for match_file in match_files:
        process_matches_from_file(c, match_file)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()