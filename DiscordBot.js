const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const pgp = require('pg-promise')();

const espn = require('./services/espn/espn');
const messenger = require('./formatters/DiscordMessenger');
const init_db = require('./db/init');
const servers = require('./db/servers');

const db = pgp(process.env.PG_CONNECTION);

if (!init_db.createTablesIfNotExist(db)) {
    process.exit(1);
}

// support for ESPN private leagues
const apiConfiguration = {
    cookie: process.env.COOKIE_VALUE ? process.env.COOKIE_VALUE : ""
};

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName.toLowerCase() === 'ping') {
        await interaction.reply('pong!');
        return;
    }

    if (interaction.commandName.toLowerCase() === 'config') {
        if (interaction.options.get('league') === null) {
            let league = await servers.getLeagueFromServer(db, interaction.guildId);
            if (league !== null) {
                await interaction.reply(`League ID currently configured: ${league}`);
            } else {
                await interaction.reply('League not configured!');
            }
        } else {
            let leagueId = interaction.options.get('league').value;
            let exists = await espn.validateLeague(leagueId, apiConfiguration);
            if (!exists) {
                await interaction.reply('League does not exist!');
                return;
            }
            await servers.deleteLeagueRelation(db, interaction.guildId);
            let status = await servers.setLeagueForServer(db, interaction.guildId, leagueId);
            if (!status) {
                await interaction.reply('Server does not exist!');
            } else {
                await interaction.reply('League ID set!');
            }
        }
        return;
    }

    // All commands below this line will require league anyways...
    let leagueId = await servers.getLeagueFromServer(db, interaction.guildId);
    if (leagueId === null) {
        await interaction.reply('Please configure this bot using /config');
        return;
    }

    if (interaction.commandName.toLowerCase() === 'league') {
        let leagueInfo = await espn.leagueInfo(leagueId, apiConfiguration);
        let reply = messenger.getLeagueInfo(leagueInfo);
        await interaction.reply({ embeds: [reply] });
        return;
    }

    if (interaction.commandName.toLowerCase() === 'roster') {
        let team = interaction.options.get('identifier').value;
        let leagueInfo = await espn.leagueInfo(leagueId, apiConfiguration);
        let targetTeam = null;

        // check if team exists before continuing
        for (let t of leagueInfo.teams) {
            if (t.abbrev.toLowerCase() === team.toLowerCase()) {
                targetTeam = t
            }
        }
        if (targetTeam === null) {
            await interaction.reply('Argument given does not match any team!');
            return;
        }

        let roster = await espn.roster(leagueId, apiConfiguration, targetTeam);
        let reply = messenger.getRoster(targetTeam, roster);
        await interaction.reply({ embeds: [reply] });
        return;
    }

    if (interaction.commandName.toLowerCase() === 'standings') {
        let standings = await espn.standings(leagueId, apiConfiguration);
        let reply = messenger.getStandings(standings);
        await interaction.reply({ embeds: [reply] });
        return;
    }

    if (interaction.commandName.toLowerCase() === 'schedule') {
        let option = interaction.options.get('option').value;
        let value = interaction.options.get('value').value;
        // manual argument validation (two options: 'team' and 'week')
        if (option.toLowerCase() === 'team') {
            let userSchedule = await espn.teamSchedule(leagueId, apiConfiguration, value);
            if (userSchedule.length === 0) {
                await interaction.reply('Invalid team!');
                return;
            }
            let reply = messenger.getTeamSchedule(userSchedule);
            await interaction.reply({ embeds: [reply] });
        } else if (option.toLowerCase() === 'week') {
            let weekSchedule = await espn.weekSchedule(leagueId, apiConfiguration, value);
            if (weekSchedule.length === 0) {
                await interaction.reply('Invalid week!');
                return;
            }
            let reply = messenger.getWeekSchedule(weekSchedule);
            await interaction.reply({ embeds: [reply] });
        } else {
            await interaction.reply('Invalid option!');
        }
        return;
    }
});

client.login(process.env.DISCORD_TOKEN);
