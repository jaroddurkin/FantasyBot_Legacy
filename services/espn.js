const axios = require('axios');
const fantasy = require('./objects');

const ESPN_SERVICE_URL = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/"

const ESPN_POSITION_MAPS = {
    1: "QB",
    2: "RB",
    3: "WR",
    4: "TE",
    5: "K",
    16: "D/ST"
}

const ESPN_NFLTEAM_MAPS = {
    0: "FA",
    1: "ATL",
    2: "BUF",
    3: "CHI",
    4: "CIN",
    5: "CLE",
    6: "DAL",
    7: "DEN",
    8: "DET",
    9: "GB",
    10: "TEN",
    11: "IND",
    12: "KC",
    13: "LV",
    14: "LAR",
    15: "MIA",
    16: "MIN",
    17: "NE",
    18: "NO",
    19: "NYG",
    20: "NYJ",
    21: "PHI",
    22: "ARI",
    23: "PIT",
    24: "LAC",
    25: "SF",
    26: "SEA",
    27: "TB",
    28: "WAS",
    29: "CAR",
    30: "JAX",
    33: "BAL",
    34: "HOU"
}

module.exports = {

    validateLeague: async function(id, cookie) {
        let response = await sendRequest(id, "", cookie);
        if (Object.keys(response).length === 0) {
            return false;
        } else {
            return true;
        }
    },

    leagueInfo: async function(id, cookie) {
        let response = await sendRequest(id, "", cookie);
        let teamList = response["teams"];
        let league = new fantasy.League(id, response["settings"].name);
        for (var team of teamList) {
            let newTeam = new fantasy.Team(team.id, team.location, team.nickname, team.abbrev);
            league.addTeam(newTeam);
        }
        return league;
    },

    leagueSettings: async function(id) {
        let response = await sendRequest(id, "?view=mSettings");
    },

    matchups: async function(id) {
        let response = await sendRequest(id, "?view=mMatchup");
    },

    roster: async function(id, cookie, team) {
        let response = await sendRequest(id, "?view=mRoster", cookie);
        let roster = [];
        for (let t of response.teams) {
            if (t["id"] != team.id) {
                continue;
            } else {
                for (let player of t.roster.entries) {
                    let playerName = player["playerPoolEntry"]["player"]["fullName"];
                    let playerId = player["playerId"];
                    let playerTeam = ESPN_NFLTEAM_MAPS[player["playerPoolEntry"]["player"]["proTeamId"]];
                    let playerPosition = ESPN_POSITION_MAPS[player["playerPoolEntry"]["player"]["defaultPositionId"]];
                    roster.push(new fantasy.Player(playerName, playerId, playerTeam, playerPosition));
                }
            }
        }
        return roster;
    },

    standings: async function(id, cookie) {
        let response = await sendRequest(id, "?view=mTeam", cookie);
        let teams = {};
        for (let t of response.teams) {
            let team = new fantasy.Team(t.id, t.location, t.nickname, t.abbrev);
            let record = {};
            record["W"] = t["record"]["overall"]["wins"];
            record["L"] = t["record"]["overall"]["losses"]
            record["T"] = t["record"]["overall"]["ties"]
            record["GB"] = t["record"]["overall"]["gamesBack"]
            if (t["record"]["overall"]["streakType"] != null) {
                record["streak"] = t["record"]["overall"]["streakLength"] + t["record"]["overall"]["streakType"][0];
            } else {
                record["streak"] = "0W";
            }
            record["PF"] = t["record"]["overall"]["pointsFor"];
            record["PA"] = t["record"]["overall"]["pointsAgainst"];
            record["seed"] = t["playoffSeed"];
            record["fullTeam"] = team;
            teams[t.id] = record;
        }
        return teams;
    }

}

async function sendRequest(id, settings, cookie) {
    let res = await axios.get(ESPN_SERVICE_URL + id + settings,
        {
            headers: {
                Cookie: cookie
            },
            withCredentials: true
        })
        .then(function (res) {
            return res.data;
        })
        .catch(function (err) {
            return {};
        });
    return res;
} 