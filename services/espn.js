const axios = require('axios');
const fantasy = require('./objects');

const ESPN_SERVICE_URL = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/"

module.exports = {

    leagueInfo: async function(id) {
        let response = await sendRequest(id, "");
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
    }

}

async function sendRequest(id, settings) {
    let res = await axios.get(ESPN_SERVICE_URL + id + settings)
        .then(function (res) {
            return res.body;
        })
        .catch(function (err) {
            console.log(err);
            return {};
        });
    return res;
} 