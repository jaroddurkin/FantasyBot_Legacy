const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// TODO abstract into separate JSON
const commands = [{
    name: 'ping',
    description: 'Health check.'
},
{
    name: 'testapi',
    description: 'Random command to test what comes from APIs'
}];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Begin refresh of commands...');
        if (process.argv.length > 2 && process.argv[2] == 'global') {
            await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                { body: commands },
            );
        } else {
            await rest.put(
                Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_DEV_SERVER),
                { body: commands },
            );
        }
        console.log('Successfully refreshed commands.');
    } catch (err) {
        console.log(err);
    }
})();