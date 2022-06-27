module.exports = {
    
    getLeagueInfo: function(league) {
        let msgOut = { 'blocks': [] };
        msgOut.blocks.push(createSection(`Teams in ${league.name}`));
        for (var team of league.teams) {
            let text = `*${team.abbrev}*\n${team.location} ${team.name}`;
            msgOut.blocks.push(createSection(text));
        }
        return msgOut;
    },

    getRoster: function(team, roster) {
        let msgOut = { 'blocks': [] };
        let title = `Players currently on:\n*${team.location} ${team.name} (${team.abbrev})*`;
        msgOut.blocks.push(createSection(title));
        for (var player of roster) {
            let text = `*${player.name}*\n`;
            text += `Position: ${player.position}\n`;
            text += `Team: ${player.nflTeam}\n`;
            text += `Status: ${player.injuryStatus}`;
            msgOut.blocks.push(createSection(text));
        }
        return msgOut;
    },

    getStandings: function(standings) {
        let msgOut = { 'blocks': [] };
        msgOut.blocks.push(createSection('*Current Standings*'));
        
        let sort = Array(Object.keys(standings).length).fill(null);
        for (let team in standings) {
            let record = standings[team];
            t = record['fullTeam'];
            let text = `*${t.location} ${t.name} (${t.abbrev})*\n`
            text += `Seed: ${record.seed}\n`;
            text += `Record: ${record.W}-${record.L}-${record.T}\n`;
            text += `Games Back: ${record.GB}\n`;
            text += `Points For: ${record.PF}\n`;
            text += `Points Against: ${record.PA}`;
            sort[record.seed - 1] = text;
        }

        for (let line of sort) {
            msgOut.blocks.push(createSection(line));
        }
        return msgOut;
    },

    getTeamSchedule: function(schedule) {
        let msgOut = { 'blocks': [] };
        msgOut.blocks.push(createSection(`*Schedule for ${schedule[0].user.location} ${schedule[0].user.name}*`));

        for (let game of schedule) {
            let text = `*Game ${game.gameNumber}*\n`;
            text += `${game.opponent.location} ${game.opponent.name} (${game.opponent.abbrev})\n`;
            text += `Score: ${game.userPoints} - ${game.oppPoints}\n`;
            text += `Result: ${game.gameResult}`;
            msgOut.blocks.push(createSection(text));
        };

        return msgOut;
    },

    getWeekSchedule: function(schedule) {
        let msgOut = { 'blocks': [] };
        msgOut.blocks.push(createSection(`*Schedule for Game ${schedule[0].week}*`));

        for (let game of schedule) {
            let text = `*${game.away.location} ${game.away.name} vs. ${game.home.location} ${game.home.name}*\n`;
            text += `Score: ${game.away.abbrev} ${game.awayPoints} - ${game.homePoints} ${game.home.abbrev}\n`;
            text += `Winner: ${game.winner}`;
            msgOut.blocks.push(createSection(text));
        }

        return msgOut;
    }
}

function createSection(text) {
    return {
        'type': 'section',
        'text': {
            'type': 'mrkdwn',
            'text': text
        }
    }
}
