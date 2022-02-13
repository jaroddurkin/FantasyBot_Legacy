module.exports = {

    getLeagueInfo: function(league) {
        let msgOut = "";
        msgOut += "Teams in " + league.name;
        for (var team of league.teams) {
            msgOut += "\n";
            msgOut += team.location + " " + team.name + " (" + team.abbrev + ")";
        }
        return msgOut;
    }
}