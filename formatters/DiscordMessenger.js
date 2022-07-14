const { MessageEmbed } = require('discord.js');

module.exports = {

    getLeagueInfo: function(league) {
        let msgOut = new MessageEmbed();
        msgOut.setTitle(`Teams in ${league.name}`);
        for (var team of league.teams) {
            msgOut.addFields({
                name: team.nickname,
                value: team.name
            });
        }
        return msgOut;
    },

    getRoster: function(team, roster) {
        let msgOut = new MessageEmbed();
        msgOut.setTitle(`Players currently on ${team.name} (${team.nickname})`);
        for (var player of roster) {
            value = `Position: ${player.position}\n`;
            value += `Team: ${player.nflTeam}\n`;
            value += `Status: ${player.injuryStatus}`;
            msgOut.addFields({
                name: player.name,
                value: value
            });
        }
        return msgOut;
    },

    getStandings: function(standings) {
        let msgOut = new MessageEmbed();
        msgOut.setTitle('Current standings');
        
        // team list from API is not automatically sorted, so we fill based on seed during loop
        let sort = Array(Object.keys(standings).length).fill(null);
        for (let team in standings) {
            let record = standings[team];
            t = record['fullTeam'];
            line = {};
            line.name = `${t.name} (${t.nickname})`;
            line.value = `Seed: ${record.seed}\n`;
            line.value += `Record: ${record.W}-${record.L}-${record.T}\n`;
            line.value += `Games Back: ${record.GB}\n`;
            line.value += `Points For: ${record.PF}\n`;
            line.value += `Points Against: ${record.PA}`;
            sort[record.seed - 1] = line;
        }

        for (let line of sort) {
            msgOut.addFields(line);
        }
        return msgOut;
    },

    getTeamSchedule: function(schedule) {
        let msgOut = new MessageEmbed();
        msgOut.setTitle(`Schedule for ${schedule[0].homeTeam.name}`);

        for (let game of schedule) {
            let value = `${game.awayTeam.name} (${game.awayTeam.nickname})\n`;
            value += `Score: ${game.homePoints} - ${game.awayPoints}\n`;
            if (game.winner == game.awayTeam.nickname) {
                value += 'Result: L';
            } else if (game.winner == game.homeTeam.nickname) {
                value += 'Result: W';
            } else {
                value = 'Result: T';
            }
            msgOut.addFields({
                name: `Game: ${game.week}`,
                value: value
            });
        }

        return msgOut;
    },

    getWeekSchedule: function(schedule) {
        let msgOut = new MessageEmbed();
        msgOut.setTitle(`Schedule for Game ${schedule[0].week}`);

        for (let game of schedule) {
            let name = `${game.awayTeam.name} vs. ${game.homeTeam.name}`;
            let value = `Score: ${game.awayTeam.nickname} ${game.awayPoints} - ${game.homePoints} ${game.homeTeam.nickname}\n`;
            value += `Winner: ${game.winner}`;
            msgOut.addFields({
                name: name,
                value: value
            });
        }
        
        return msgOut;
    }
}
