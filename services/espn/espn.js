const fantasy = require('../objects');
const service = require('./init');

const ESPN_POSITION_MAPS = {
    1: 'QB',
    2: 'RB',
    3: 'WR',
    4: 'TE',
    5: 'K',
    16: 'D/ST'
};

const ESPN_NFLTEAM_MAPS = {
    0: 'Free Agent (FA)',
    1: 'Falcons (ATL)',
    2: 'Bills (BUF)',
    3: 'Bears (CHI)',
    4: 'Bengals (CIN)',
    5: 'Browns (CLE)',
    6: 'Cowboys (DAL)',
    7: 'Broncos (DEN)',
    8: 'Lions (DET)',
    9: 'Packers (GB)',
    10: 'Titans (TEN)',
    11: 'Colts (IND)',
    12: 'Chiefs (KC)',
    13: 'Raiders (LV)',
    14: 'Rams (LAR)',
    15: 'Dolphins (MIA)',
    16: 'Vikings (MIN)',
    17: 'Patriots (NE)',
    18: 'Saints (NO)',
    19: 'Giants (NYG)',
    20: 'Jets (NYJ)',
    21: 'Eagles (PHI)',
    22: 'Cardinals (ARI)',
    23: 'Steelers (PIT)',
    24: 'Chargers (LAC)',
    25: '49ers (SF)',
    26: 'Seahawks (SEA)',
    27: 'Buccaneers (TB)',
    28: 'Commanders (WAS)',
    29: 'Panthers (CAR)',
    30: 'Jaguars (JAX)',
    33: 'Ravens (BAL)',
    34: 'Texans (HOU)'
};

module.exports = {

    validateLeague: async function(id, config) {
        let response = await service.sendRequest(id, '', config);
        if (Object.keys(response).length === 0) {
            return false;
        } else {
            return true;
        }
    },

    leagueInfo: async function(id, config) {
        let response = await service.sendRequest(id, '', config);
        let teamList = response['teams'];
        let league = new fantasy.League(id, response['settings'].name);
        for (var team of teamList) {
            let newTeam = new fantasy.Team(team.id, `${team.location} ${team.nickname}`, team.abbrev);
            league.addTeam(newTeam);
        }
        return league;
    },

    roster: async function(id, config, team) {
        let response = await service.sendRequest(id, '?view=mRoster', config);
        let roster = [];
        for (let t of response.teams) {
            if (t['id'] !== team.id) {
                continue;
            } else {
                for (let player of t.roster.entries) {
                    let playerName = player['playerPoolEntry']['player']['fullName'];
                    let playerId = player['playerId'];
                    let playerTeam = ESPN_NFLTEAM_MAPS[player['playerPoolEntry']['player']['proTeamId']];
                    let playerPosition = ESPN_POSITION_MAPS[player['playerPoolEntry']['player']['defaultPositionId']];
                    let injuryStatus;
                    // defense positions don't have an entry for injuries, so this is hardcoded
                    if (playerPosition === 'D/ST') {
                        injuryStatus = 'N/A';
                    } else {
                        let status = player['playerPoolEntry']['player']['injuryStatus'];
                        injuryStatus = status[0] + status.slice(1).toLowerCase();
                    }
                    roster.push(new fantasy.Player(playerName, playerId, playerTeam, playerPosition, injuryStatus));
                }
            }
        }
        return roster;
    },

    standings: async function(id, config) {
        let response = await service.sendRequest(id, '?view=mTeam', config);
        let teams = {};
        for (let t of response.teams) {
            let team = new fantasy.Team(t.id, `${t.location} ${t.nickname}`, t.abbrev);
            let record = {};
            record['W'] = t['record']['overall']['wins'];
            record['L'] = t['record']['overall']['losses']
            record['T'] = t['record']['overall']['ties']
            record['GB'] = t['record']['overall']['gamesBack']
            // streak may be null (in the case of games not being played yet)
            if (t['record']['overall']['streakType'] !== null) {
                record['streak'] = t['record']['overall']['streakLength'] + t['record']['overall']['streakType'][0];
            } else {
                record['streak'] = '0W';
            }
            record['PF'] = t['record']['overall']['pointsFor'].toFixed(2);
            record['PA'] = t['record']['overall']['pointsAgainst'].toFixed(2);
            record['seed'] = t['playoffSeed'];
            record['fullTeam'] = team;
            teams[t.id] = record;
        }
        return teams;
    },

    teamSchedule: async function(id, config, givenTeam) {
        let league = await this.leagueInfo(id, config);
        let teamId = -1;
        let teamMap = {};
        for (let team of league.teams) {
            if (team.nickname.toLowerCase() === givenTeam.toLowerCase()) {
                teamId = team.id;
            }
            teamMap[team.id] = team;
        }
        let response = await service.sendRequest(id, '?view=mMatchup', config);
        let schedule = [];
        for (let matchup of response.schedule) {
            let userPoints, oppPoints, opponent;
            let gameNumber = matchup['matchupPeriodId'];
            // games are not returned by a per team basis
            // the selected user could be either home or away so we check before assuming
            if (matchup['home']['teamId'] === teamId) {
                userPoints = matchup['home']['totalPoints'];
                oppPoints = matchup['away']['totalPoints'];
                opponent = teamMap[matchup['away']['teamId']];
            } else if (matchup['away']['teamId'] === teamId) {
                userPoints = matchup['away']['totalPoints'];
                oppPoints = matchup['home']['totalPoints'];
                opponent = teamMap[matchup['home']['teamId']];
            } else {
                continue;
            }
            let game = {};
            game['userPoints'] = userPoints;
            game['oppPoints'] = oppPoints;
            game['user'] = teamMap[teamId];
            game['opponent'] = opponent;
            game['gameNumber'] = gameNumber;
            let gameResult;
            if (userPoints > oppPoints) {
                gameResult = 'W';
            } else if (userPoints === oppPoints) {
                gameResult = 'T';
            } else {
                gameResult = 'L';
            }
            game['gameResult'] = gameResult;
            schedule.push(game);
        }
        return schedule;
    },

    weekSchedule: async function(id, config, week) {
        let league = await this.leagueInfo(id, config);
        let teamMap = {};
        for (let team of league.teams) {
            teamMap[team.id] = team;
        }
        let response = await service.sendRequest(id, '?view=mMatchup', config);
        let schedule = [];
        for (let matchup of response.schedule) {
            if (matchup['matchupPeriodId'].toString() !== week) {
                continue;
            }
            let game = {};
            game['homePoints'] = matchup['home']['totalPoints'];
            game['awayPoints'] = matchup['away']['totalPoints'];
            game['home'] = teamMap[matchup['home']['teamId']];
            game['away'] = teamMap[matchup['away']['teamId']];
            game['week'] = week;
            if (game['homePoints'] > game['awayPoints']) {
                game['winner'] = game['home'].nickname;
            } else if (game['homePoints'] == game['awayPoints']) {
                game['winner'] = 'Tie';
            } else {
                game['winner'] = game['away'].nickname;
            }
            schedule.push(game);
        }
        return schedule;
    }

};
