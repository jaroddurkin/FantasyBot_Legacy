const { MessageEmbed } = require('discord.js');

module.exports = {

    getLeagueInfo: function(league) {
        let msgOut = new MessageEmbed();
        msgOut.setTitle("Teams in " + league.name);
        for (var team of league.teams) {
            msgOut.addFields({
                name: team.abbrev,
                value: team.location + " " + team.name
            });
        }
        return msgOut;
    },

    getRoster: function(team, roster) {
        let msgOut = new MessageEmbed();
        msgOut.setTitle("Players currently on " + team.location + " " + team.name + " (" + team.abbrev + ")");
        for (var player of roster) {
            msgOut.addFields({
                name: player.name,
                value: player.position + ", " + player.nflTeam
            });
        }
        return msgOut;
    },

    getStandings: function(standings) {
        let msgOut = new MessageEmbed();
        msgOut.setTitle("Current standings");
        
        let sort = Array(Object.keys(standings).length).fill(null);
        for (let team in standings) {
            let record = standings[team];
            t = record["fullTeam"];
            line = "(" + record.seed + ") " + t.location + " " + t.name + " (" + t.abbrev + ") " + record.W + "-" + record.L + "-" + record.T + " (" + record.GB + ") " + record.PF + " " + record.PA + "\n";
            line = {};
            line.name = t.location + " " + t.name + " (" + t.abbrev + ")";
            line.value = "Seed: " + record.seed + "\n";
            line.value += "Record: " + record.W + "-" + record.L + "-" + record.T + "\n";
            line.value += "Games Back: " + record.GB + "\n";
            line.value += "Points For: " + record.PF + "\n";
            line.value += "Points Against: " + record.PA;
            sort[record.seed - 1] = line;
        }

        for (let line of sort) {
            msgOut.addFields(line);
        }
        return msgOut;
    }
}