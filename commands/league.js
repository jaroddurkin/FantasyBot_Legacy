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
    },

    getStandings: function(standings) {
        let msgOut = "";
        msgOut += "Current standings: \n";
        msgOut += "\nSEED, TEAM (ABBREV), RECORD, GB, PF, PA\n"
        
        let sort = Array(Object.keys(standings).length).fill(null);
        for (let team in standings) {
            let record = standings[team];
            t = record["fullTeam"];
            line = "(" + record.seed + ") " + t.location + " " + t.name + " (" + t.abbrev + ") " + record.W + "-" + record.L + "-" + record.T + " (" + record.GB + ") " + record.PF + " " + record.PA + "\n";
            sort[record.seed - 1] = line;
        }

        for (let line of sort) {
            msgOut += line;
        }
        return msgOut;
    }
}