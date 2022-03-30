const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const espn = require('./services/espn');
const league = require('./commands/league');

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName == 'ping') {
        await interaction.reply('pong!');
    }

    if (interaction.commandName == 'league') {
        let leagueInfo = await espn.leagueInfo("236073018", process.env.COOKIE_VALUE);
        let reply = league.getLeagueInfo(leagueInfo);
        await interaction.reply(reply);
    }

    if (interaction.commandName == "roster") {
        let team = interaction.options.get("identifier").value;
        let leagueInfo = await espn.leagueInfo("236073018", process.env.COOKIE_VALUE);
        let targetTeam = null;
        for (let t of leagueInfo.teams) {
            if (t.abbrev.toLowerCase() === team.toLowerCase()) {
                targetTeam = t
            }
        }
        if (targetTeam === null) {
            await interaction.reply("Argument given does not match any team!");
            return;
        }
        let roster = await espn.roster("236073018", process.env.COOKIE_VALUE, targetTeam);
        let reply = league.constructRoster(targetTeam, roster);
        await interaction.reply(reply);
    }
});

client.login(process.env.DISCORD_TOKEN);
