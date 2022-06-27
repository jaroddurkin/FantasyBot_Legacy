const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = require('./all-commands')

const jsonCommands = commands.buildCommands();

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Begin refresh of commands...');
        if (process.argv.length > 2 && process.argv[2] == 'global') {
            await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                { body: jsonCommands },
            );
        } else {
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
