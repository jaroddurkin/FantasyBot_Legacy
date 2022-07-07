const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = require('./all-commands')

const jsonCommands = commands.buildCommands();

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Begin refresh of commands...');
        // this will add commands to ALL servers (may take an hour per discord docs)
        if (process.argv.length > 2 && process.argv[2].toLowerCase() === 'global') {
            await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                { body: jsonCommands },
            );
        } else {
            // this will add commands immediately to a server ID of your choice (ID in DISCORD_DEV_SERVER env var)
            await rest.put(
                Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_DEV_SERVER),
                { body: jsonCommands },
            );
        }
        console.log('Successfully refreshed commands.');
    } catch (err) {
        console.log(err);
    }
})();
