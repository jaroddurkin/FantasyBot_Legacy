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

    if (interaction.commandName == 'testapi') {
        let leagueInfo = await espn.leagueInfo("236073018", process.env.COOKIE_VALUE);
        let reply = league.getLeagueInfo(leagueInfo);
        await interaction.reply(reply);
    }
});

client.login(process.env.DISCORD_TOKEN);
