import sqlite3

def populate_teams():
    conn = sqlite3.connect('league.db')
    c = conn.cursor()

    teams = [
        # Add team data in the format (tag, full_name, region)
        ('G2', 'G2 Esports', 'EU'),
        ('BDS', 'Team BDS', 'EU'),
        ('SECRET', 'Team Secret', 'EU'),
        ('ITB', 'Into The Breach', 'EU'),
        ('VP', 'Virtus.Pro', 'EU'),
        ('WOL', 'Wolves Esports', 'EU'),
        ('WYLDE', 'WYLDE', 'EU'),
        ('FNC', 'Fnatic', 'EU'),
        ('ENCE', 'ENCE', 'EU'),

        ('C9BC', 'Cloud9 Beastcoast', 'NA'),
        ('DZ', 'DarkZero', 'NA'),
        ('M80', 'M80', 'NA'),
        ('OXG', 'Oxygen Esports', 'NA'),
        ('WC', 'Wildcard Gaming', 'NA'),
        ('SQ', 'Soniqs', 'NA'),
        ('SSG', 'Spacestation Gaming', 'NA'),
        ('LG', 'Luminosity Gaming', 'NA'),
        ('LOS', 'LOS', 'NA'),

        ('FAZE', 'FaZe Clan', 'BR'),
        ('W7M', 'W7M Esports', 'BR'),
        ('LIQUID', 'Team Liquid', 'BR'),
        ('NIP', 'Ninjas in Pyjamas', 'BR'),
        ('BD', 'Black Dragons', 'BR'),
        ('E1', 'E1 Sports', 'BR'),
        ('FLUXO', 'Fluxo', 'BR'),
        ('KS', 'Vivo Keyd Stars', 'BR'),
        ('FURIA', 'FURIA', 'BR'),
        ('MIBR', 'MIBR', 'BR'),

        ('SZ', 'Kawasaki Scarz', 'JPN'),
        ('VIT', 'VITE', 'JPN'),
        ('KNT', 'KINOTROPE Gaming', 'JPN'),
        ('CAG', 'CAG OSAKA', 'JPN'),
        ('IGZ', 'IGZIST', 'JPN'),
        ('FB', 'Father\'s Back', 'JPN'),
        ('CGL', 'CREST Gaming Lst', 'JPN'),
        ('E36', 'ENTRY FORCE.36', 'JPN'),

        ('PSG', 'PSG Talon', 'KR'),
        ('MIR', 'Mir Gaming', 'KR'),
        ('BLS', 'BlossoM', 'KR'),
        ('ORG', 'Orgless-kr', 'KR'),
        ('FOX', 'BNK FearX', 'KR'),
        ('WEBL', 'WEBL', 'KR'),
        ('DK', 'Dplus KIA', 'KR'),
        ('BNA', 'Before & After', 'KR'),

        ('CTY', 'Team Cruelty', 'LATAM'),
        ('6K', 'Six Karma', 'LATAM'),
        ('RVN', 'REVEN ECLUB', 'LATAM'),
        ('NXT', 'NXT PLAYER', 'LATAM'),
        ('VASCO', 'Vasco eSports', 'LATAM'),
        ('KNI', 'Knights', 'LATAM'),
        ('ALPHA', 'Alpha Team', 'LATAM'),
        ('ME', 'Maycam Evolve', 'LATAM'),
        ('CN', 'Cinta Negra Esports', 'LATAM'),
        ('MVG', 'Malvinas Gaming', 'LATAM'),
        ('HWK', 'Hawks', 'LATAM'),
        ('ORGL', 'Orgless', 'LATAM'),
        ('7REX', '7REX TEAM', 'LATAM'),
        ('LYE', 'Lycus Empire', 'LATAM'),
        ('TSG', 'True Synergy Gaming', 'LATAM'),

        ('FURY', 'FURY', 'ASIA'),
        ('NOCAP', 'NoCap', 'ASIA'),
        ('DW', 'Dire Wolves', 'ASIA'),
        ('DAY', 'Daystar', 'ASIA'),
        ('ELV', 'Elevate', 'ASIA'),
        ('KNOCK', 'Knock Knock', 'ASIA'),
        ('BLEED', 'Bleed Esports', 'ASIA'),
        ('HW', 'Hasib Warriors', 'ASIA'),
        ('RIVAL', 'Rival Esports', 'ASIA'),

        ('GG', 'Gamin Gladiators', 'OCE'),
        ('EX-ANTC', 'Ex Antic Esports', 'OCE'),
        ('KK', 'Kelton\'s Knights', 'OCE'),
        ('ANTC', 'Antic Esports (MAN LFO)', 'OCE'),
        ('PANIC', 'Panic eSports', 'OCE'),
        ('SN', 'Supernova', 'OCE'),
        ('6T', '6Targets', 'OCE'),
        ('CS', 'Circular Spheres', 'OCE'),
        ('OL', 'Outlast Gaming', 'OCE'),
        ('CHF', 'Chiefs Esports Club', 'OCE'),
        ('PRDGY', 'Prodigy Esports', 'OCE'),
        ('ODIUM', 'Odium', 'OCE'),


        ('GK', 'Geekay Esports', 'MENA'),
        ('FLCS', 'Team Falcons', 'MENA'),
        ('DABBE', 'Dabbe E-Sport', 'MENA'),
        ('ONYX', 'ONYX RAVENS eSports', 'MENA'),
        ('TWM', 'Twisted Minds', 'MENA'),
        ('VSN', 'VISION eSports', 'MENA'),
        ('ROC', 'ROC Esports', 'MENA'),
        ('PSSN', 'Passion', 'MENA'),
        ('WB', 'Winter Bear', 'MENA'),
        ('VCS', 'The Vicious Esports', 'MENA'),
        ('EASTSIDE', 'Eastside', 'MENA'),
        ('AKA', 'AKATSUKI', 'MENA')
    ]

    # Define the starting Elo based on the region
    elo_by_region = {
        'NA': 1500,
        'EU': 1500,
        'BR': 1500,
        'OCE': 1375,
        'ASIA': 1375,
        'JPN': 1375,
        'KR': 1375,
        'LATAM': 1325,
        'MENA': 1375
    }

    # Insert teams into the database
    for tag, full_name, region in teams:
        starting_elo = elo_by_region.get(region)
        c.execute('''
            INSERT OR IGNORE INTO teams (tag, full_name, region, elo)
            VALUES (?, ?, ?, ?)
        ''', (tag, full_name, region, starting_elo))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    populate_teams()
