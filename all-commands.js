const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

    buildCommands: function() {
        return [
            new SlashCommandBuilder().setName('ping').setDescription('Health check.'),
            new SlashCommandBuilder().setName('league').setDescription('Get the teams currently in the league.'),
            new SlashCommandBuilder().setName('roster').setDescription('Get the roster for a given team.').addStringOption(option => {
                return option.setName('identifier').setRequired(true).setDescription("The team that you want to fetch the roster for.")
            }),
            new SlashCommandBuilder().setName('config').setDescription('Configure the bot using a platform and league ID.').addStringOption(option => {
                return option.setName('platform').setRequired(false).setDescription('Sleeper or ESPN');
            }).addStringOption(option => {
                return option.setName('league').setRequired(false).setDescription('The league ID for the platform given.');
            }),
            new SlashCommandBuilder().setName('standings').setDescription('Gets the current standings for the league.'),
            new SlashCommandBuilder().setName('schedule').setDescription('Prints the schedule given your parameters.').addStringOption(option => {
                return option.setName('option').setRequired(true).addChoice('team', 'team').addChoice('week', 'week').setDescription('Choose to get a schedule for a single team or all matchups for a week.')
            }).addStringOption(option => {
                return option.setName('value').setRequired(true).setDescription('The abbreviation of the team or the week number.');
            })
        ].map(command => command.toJSON());
    }
};
