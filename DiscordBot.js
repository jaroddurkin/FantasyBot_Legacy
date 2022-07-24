const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const pgp = require('pg-promise')();

const espn = require('./services/espn/espn');
const sleeper = require('./services/sleeper/sleeper');
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
        if (interaction.options.get('league') === null && interaction.options.get('platform') === null) {
            let config = await servers.getConfigForServer(db, interaction.guildId);
            if (config !== null) {
                await interaction.reply(`Currently configured for platform: ${config.platform} with league: ${config.league}`);
            } else {
                await interaction.reply('No configuration found!');
            }
        } else if (interaction.options.get('league') === null || interaction.options.get('platform') === null) {
            await interaction.reply('Invalid arguments!');
        } else {
            let leagueId = interaction.options.get('league').value;
            let platform = interaction.options.get('platform').value.toLowerCase();
            if (platform !== "espn" && platform !== "sleeper") {
                await interaction.reply("Invalid platform!");
            }
            let exists = false;
            if (platform === "espn") {
                exists = await espn.validateLeague(leagueId, apiConfiguration);
            } else {
                exists = await sleeper.validateLeague(leagueId);
            }
            if (!exists) {
                await interaction.reply('League does not exist!');
                return;
            }
            await servers.deleteLeagueRelation(db, interaction.guildId);
            let status = await servers.setConfigForServer(db, interaction.guildId, platform, leagueId);
            if (!status) {
                await interaction.reply('Server does not exist!');
            } else {
                await interaction.reply('Successfully configured bot!');
            }
        }
        return;
    }

    // All commands below this line will require league anyways...
    let config = await servers.getConfigForServer(db, interaction.guildId);
    if (config === null) {
        await interaction.reply('Please configure this bot using /config');
        return;
    }
    let leagueId = config.league;
    let platform = config.platform;
    
    let service = null;
    if (platform === "espn") {
        service = espn;
    } else {
        service = sleeper;
    }

    if (interaction.commandName.toLowerCase() === 'league') {
        let leagueInfo = await service.leagueInfo(leagueId, apiConfiguration);
        let reply = messenger.getLeagueInfo(leagueInfo);
        await interaction.reply({ embeds: [reply] });
        return;
    }

    if (interaction.commandName.toLowerCase() === 'roster') {
        let team = interaction.options.get('identifier').value;
        let leagueInfo = await service.leagueInfo(leagueId, apiConfiguration);
        let targetTeam = null;

        // check if team exists before continuing
        for (let t of leagueInfo.teams) {
            if (t.nickname.toLowerCase() === team.toLowerCase()) {
                targetTeam = t
            }
        }
        if (targetTeam === null) {
            await interaction.reply('Argument given does not match any team!');
            return;
        }

        let roster = await service.roster(leagueId, targetTeam, apiConfiguration);
        let reply = messenger.getRoster(targetTeam, roster);
        await interaction.reply({ embeds: [reply] });
        return;
    }

    if (interaction.commandName.toLowerCase() === 'standings') {
        let standings = await service.standings(leagueId, apiConfiguration);
        let reply = messenger.getStandings(standings);
        await interaction.reply({ embeds: [reply] });
        return;
    }

    if (interaction.commandName.toLowerCase() === 'schedule') {
        let option = interaction.options.get('option').value;
        let value = interaction.options.get('value').value;
        // manual argument validation (two options: 'team' and 'week')
        if (option.toLowerCase() === 'team') {
            if (platform === 'sleeper') {
                await interaction.reply('Team schedules not supported yet for Sleeper leagues :(');
                return;
            }
            let userSchedule = await service.teamSchedule(leagueId, value, apiConfiguration);
            if (userSchedule.length === 0) {
                await interaction.reply('Invalid team!');
                return;
            }
            let reply = messenger.getTeamSchedule(userSchedule);
            await interaction.reply({ embeds: [reply] });
        } else if (option.toLowerCase() === 'week') {
            let weekSchedule = await service.weekSchedule(leagueId, value, apiConfiguration);
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
