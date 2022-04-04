const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const pgp = require('pg-promise')();

const espn = require('./services/espn');
const league = require('./commands/league');
const init_db = require('./db/init');
const servers = require('./db/servers');

const db = pgp(process.env.PG_CONNECTION);

if (!init_db.createTablesIfNotExist(db)) {
    process.exit(1);
}

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName == 'ping') {
        await interaction.reply('pong!');
    }

    if (interaction.commandName == 'config') {
        if (interaction.options.get("league") == null) {
            let league = await servers.getLeagueFromServer(db, interaction.guildId);
            if (league != null) {
                await interaction.reply("League ID currently configured: " + league);
                return;
            } else {
                await interaction.reply("League not configured!");
                return;
            }
        } else {
            let leagueId = interaction.options.get("league").value;
            await servers.deleteLeagueRelation(db, interaction.guildId);
            let status = await servers.setLeagueForServer(db, interaction.guildId, leagueId);
            if (!status) {
                await interaction.reply('Server does not exist!');
                return;
            } else {
                await interaction.reply("League ID set!");
                return;
            }
        }
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
        let reply = league.getRoster(targetTeam, roster);
        await interaction.reply(reply);
    }
});

client.login(process.env.DISCORD_TOKEN);
