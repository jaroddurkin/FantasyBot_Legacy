module.exports = {

    getLeagueInfo: function(league) {
        let msgOut = "";
        msgOut += "Teams in " + league.name;
        for (var team of league.teams) {
            msgOut += "\n";
            msgOut += team.location + " " + team.name + " (" + team.abbrev + ")";
        }
        return msgOut;
    },

    getRoster: function(team, roster) {
        let msgOut = "";
        msgOut += "Players currently on " + team.location + " " + team.name + " (" + team.abbrev + ")";
        for (var player of roster) {
            msgOut += "\n";
            msgOut += player.name + " (" + player.position + "|" + player.nflTeam + ")";
        }
        return msgOut;
    }
}