const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {

    buildCommands: function() {
        return [
            new SlashCommandBuilder().setName('ping').setDescription('Health check.'),
            new SlashCommandBuilder().setName('league').setDescription('Get the teams currently in the league.'),
            new SlashCommandBuilder().setName('roster').setDescription('Get the roster for a given team.').addStringOption(option => {
                return option.setName('identifier').setRequired(true).setDescription("The team that you want to fetch the roster for.")
            })
        ].map(command => command.toJSON());
    }
}