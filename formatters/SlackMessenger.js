module.exports = {
    
    getLeagueInfo: function(league) {
        let msgOut = { 'blocks': [] };
        msgOut.blocks.push(createSection(`Teams in ${league.name}`));
        for (var team of league.teams) {
            let text = `*${team.nickname}*\n${team.name}`;
            msgOut.blocks.push(createSection(text));
        }
        return msgOut;
    },

    getRoster: function(team, roster) {
        let msgOut = { 'blocks': [] };
        let title = `Players currently on:\n*${team.name} (${team.nickname})*`;
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
        
        // team list from API is not automatically sorted, so we fill based on seed during loop
        let sort = Array(Object.keys(standings).length).fill(null);
        for (let team in standings) {
            let record = standings[team];
            t = record['fullTeam'];
            let text = `*${t.name} (${t.nickname})*\n`
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
        msgOut.blocks.push(createSection(`*Schedule for ${schedule[0].homeTeam.name}*`));

        for (let game of schedule) {
            let text = `*Game ${game.week}*\n`;
            text += `${game.awayTeam.name} (${game.awayTeam.nickname})\n`;
            text += `Score: ${game.homePoints} - ${game.awayPoints}\n`;
            if (game.winner == game.awayTeam.nickname) {
                text += 'Result: L';
            } else if (game.winner == game.homeTeam.nickname) {
                text += 'Result: W';
            } else {
                text = 'Result: T';
            }
            msgOut.blocks.push(createSection(text));
        };

        return msgOut;
    },

    getWeekSchedule: function(schedule) {
        let msgOut = { 'blocks': [] };
        msgOut.blocks.push(createSection(`*Schedule for Game ${schedule[0].week}*`));

        for (let game of schedule) {
            let text = `*${game.awayTeam.name} vs. ${game.homeTeam.name}*\n`;
            text += `Score: ${game.awayTeam.nickname} ${game.awayPoints} - ${game.homePoints} ${game.homeTeam.nickname}\n`;
            text += `Winner: ${game.winner}`;
            msgOut.blocks.push(createSection(text));
        }

        return msgOut;
    }
}

// slack messaging API works in blocks, this will return a JSON structure with the text we want inside it
function createSection(text) {
    return {
        'type': 'section',
        'text': {
            'type': 'mrkdwn',
            'text': text
        }
    }
}
