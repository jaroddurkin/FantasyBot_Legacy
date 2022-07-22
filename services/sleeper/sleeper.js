const fantasy = require('../objects');
const service = require('./init');

// hardcoded player data until i create automation to pull data
const playerData = require('./playerData.json');

const SLEEPER_NFLTEAM_MAPS = {
    'ATL': 'Falcons (ATL)',
    'BUF': 'Bills (BUF)',
    'CHI': 'Bears (CHI)',
    'CIN': 'Bengals (CIN)',
    'CLE': 'Browns (CLE)',
    'DAL': 'Cowboys (DAL)',
    'DEN': 'Broncos (DEN)',
    'DET': 'Lions (DET)',
    'GB': 'Packers (GB)',
    'TEN': 'Titans (TEN)',
    'IND': 'Colts (IND)',
    'KC': 'Chiefs (KC)',
    'LV': 'Raiders (LV)',
    'LAR': 'Rams (LAR)',
    'MIA': 'Dolphins (MIA)',
    'MIN': 'Vikings (MIN)',
    'NE': 'Patriots (NE)',
    'NO': 'Saints (NO)',
    'NYG': 'Giants (NYG)',
    'NYJ': 'Jets (NYJ)',
    'PHI': 'Eagles (PHI)',
    'ARI': 'Cardinals (ARI)',
    'PIT': 'Steelers (PIT)',
    'LAC': 'Charagers (LAC)',
    'SF': '49ers (SF)',
    'SEA': 'Seahawks (SEA)',
    'TB': 'Buccaneers (TB)',
    'WAS': 'Commanders (WAS)',
    'CAR': 'Panthers (CAR)',
    'JAX': 'Jaguars (JAX)',
    'BAL': 'Ravens (BAL)',
    'HOU': 'Texans (HOU)'
}

module.exports = {

    validateLeague: async function(id) {
        let response = await service.sendRequest(id, '');
        if (Object.keys(response).length === 0) {
            return false;
        } else {
            return true;
        }
    },

    leagueInfo: async function(id) {
        let leagueResp = await service.sendRequest(id, '');
        let league = new fantasy.League(id, leagueResp['name']);
        let userResp = await service.sendRequest(id, '/users');
        let rosterResp = await service.sendRequest(id, '/rosters');
        for (const team of userResp) {
            let roster_id;
            for (const roster of rosterResp) {
                if (roster.owner_id === team.user_id) {
                    roster_id = roster.roster_id;
                }
            }
            let teamName = team.metadata.team_name ? team.metadata.team_name : `Team ${team.display_name}`;
            let newTeam = new fantasy.Team(roster_id, teamName, team.display_name);
            league.addTeam(newTeam);
        }
        return league;
    },

    roster: async function(id, team) {
        let userResp = await service.sendRequest(id, '/users');
        let user_id;
        for (const user of userResp) {
            if (team === user.display_name) {
                user_id = user.user_id;
            }
        }
        let playerRoster = [];
        let rosterResp = await service.sendRequest(id, '/rosters');
        for (const roster of rosterResp) {
            if (roster.owner_id === user_id) {
                for (const playerNumber of roster.players) {
                    let player = playerData[playerNumber];
                    let playerName = `${player['first_name']} ${player['last_name']}`;
                    let playerTeam = player['team'] ? SLEEPER_NFLTEAM_MAPS[player['team']] : 'Free Agent (FA)';
                    let playerPosition = player['position'];
                    let injuryStatus;
                    if (playerPosition === "DEF") {
                        injuryStatus = 'N/A';
                    } else {
                        injuryStatus = player['injury_status'] ? player['injury_status'] : 'Active';
                    }
                    playerRoster.push(new fantasy.Player(playerName, playerNumber, playerTeam, playerPosition, injuryStatus));
                }
            }
        }
        return playerRoster;
    },

    standings: async function(id) {
        let userResp = await service.sendRequest(id, '/users');
        let userMap = {};
        for (const user of userResp) {
            let teamName = user.metadata.team_name ? user.metadata.team_name : `Team ${user.display_name}`;
            userMap[user.user_id] = new fantasy.Team(user.user_id, teamName, user.display_name);
        }
        let teams = [];
        let rosterResp = await service.sendRequest(id, '/rosters');
        for (const roster of rosterResp) {
            if (roster.owner_id === null) {
                continue;
            }
            let team = userMap[roster.owner_id];
            let record = {};
            record['W'] = roster['settings']['wins'];
            record['L'] = roster['settings']['losses'];
            record['T'] = roster['settings']['ties'];
            record['streak'] = roster['metadata']['streak'] ? roster['metadata']['streak'] : '0W';
            record['PF'] = roster['settings']['fpts'];
            record['PA'] = roster['settings']['fpts_against'];
            record['fullTeam'] = team;
            teams.push(record);
        }
        let sortedTeams = teams.sort((teamA, teamB) => teamB.W - teamA.W || teamB.PF - teamA.PF);
        let teamObj = {};
        let seed = 1;
        for (const team of sortedTeams) {
            team['GB'] = sortedTeams[0]['W'] - team['W'];
            team['seed'] = seed;
            teamObj[seed] = team;
            seed += 1;
        }
        return teamObj;
    },

    weekSchedule: async function(id, week) {
        let league = await this.leagueInfo(id);
        let teamMap = {};
        for (let team of league.teams) {
            teamMap[team.id] = team;
        }
        let response = await service.sendRequest(id, '/matchups/' + week);
        let schedule = [];
        if (Object.keys(response).length === 0) {
            return schedule;
        }
        let matchups = {};
        for (let matchup of response) {
            if (matchups[matchup.matchup_id]) {
                matchups[matchup.matchup_id].awayTeam = teamMap[matchup.roster_id] ? teamMap[matchup.roster_id] : new fantasy.Team('', 'Team Bot', 'Bot');
                matchups[matchup.matchup_id].awayPoints = matchup.points;
            } else {
                matchups[matchup.matchup_id] = { homeTeam: teamMap[matchup.roster_id] ? teamMap[matchup.roster_id] : new fantasy.Team('', 'Team Bot', 'Bot'), homePoints: matchup.points };
            }
        }
        for (let matchup in matchups) {
            let game = matchups[matchup];
            schedule.push(new fantasy.Game(game.homeTeam, game.homePoints, game.awayTeam, game.awayPoints, week));
        }
        return schedule;
    }
}
