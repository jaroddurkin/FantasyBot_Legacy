module.exports = {
    
    getLeagueInfo: function(league) {
        let msgOut = { "blocks": [] };
        msgOut.blocks.push(createSection("Teams in " + league.name));
        for (var team of league.teams) {
            let text =  "*" + team.abbrev + "*\n" + team.location + " " + team.name
            msgOut.blocks.push(createSection(text));
        }
        return msgOut;
    },

    getRoster: function(team, roster) {
        let msgOut = { "blocks": [] };
        let title = "Players currently on:\n*" + team.location + " " + team.name + " (" + team.abbrev + ")*";
        msgOut.blocks.push(createSection(title));
        for (var player of roster) {
            text = "*" + player.name + "*\n";
            text += "Position: " + player.position + "\n";
            text += "Team: " + player.nflTeam + "\n";
            text += "Status: " + player.injuryStatus;
            msgOut.blocks.push(createSection(text));
        }
        return msgOut;
    },

    getStandings: function(standings) {
        let msgOut = { "blocks": [] };
        msgOut.blocks.push(createSection("*Current Standings*"));
        
        let sort = Array(Object.keys(standings).length).fill(null);
        for (let team in standings) {
            let record = standings[team];
            t = record["fullTeam"];
            text = "*" + t.location + " " + t.name + " (" + t.abbrev + ")*\n"
            text += "Seed: " + record.seed + "\n";
            text += "Record: " + record.W + "-" + record.L + "-" + record.T + "\n";
            text += "Games Back: " + record.GB + "\n";
            text += "Points For: " + record.PF + "\n";
            text += "Points Against: " + record.PA;
            sort[record.seed - 1] = text
        }

        for (let line of sort) {
            msgOut.blocks.push(createSection(line));
        }
        return msgOut;
    }
}

function createSection(text) {
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": text
        }
    }
}