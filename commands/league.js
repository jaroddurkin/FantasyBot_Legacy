module.exports = {

    getLeagueInfo: function(league) {
        let msgOut = "";
        msgout += "Teams in " + league.name;
        for (var team of league.teams) {
            msgOut += "\n";
            msgOut += team.location + " " + team.nickname + " (" + team.abbrev + ")";
        }
        return msgOut;
    }
}