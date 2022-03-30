const axios = require('axios');
const fantasy = require('./objects');

const ESPN_SERVICE_URL = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/"

const ESPN_POSITION_MAPS = {
    1: "",
    2: "RB"
}

const ESPN_NFLTEAM_MAPS = {
    29: "CAR"
}

module.exports = {

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
            console.log(err);
            return {};
        });
    return res;
} 