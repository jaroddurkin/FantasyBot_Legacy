const { App } = require('@slack/bolt');
const pgp = require('pg-promise')();

const espn = require('./services/espn/espn');
const sleeper = require('./services/sleeper/sleeper');
const messenger = require('./formatters/SlackMessenger');
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

const app = new App({
    token: process.env.SLACK_TOKEN,
    appToken: process.env.SLACK_APPTOKEN,
    socketMode: true
});

async function validateConfiguration(say, id) {
    let config = await servers.getConfigForServer(db, id);
    console.log(config);
    if (config === null) {
        await say('Please configure this bot using /config');
        return {service: null, platform: '', leagueId: ''};
    } else {
        return {service: config.platform === "espn" ? espn : sleeper, platform: config.platform, leagueId: config.league};
    }
}

app.command('/ping', async ({command, ack, say}) => {
    await ack();
    await say('Pong!');
});

app.command('/config', async ({command, ack, say}) => {
    await ack();
    if (command.text.length === 0) {
        let config = await servers.getConfigForServer(db, command.channel_id);
        if (config !== null) {
            await say(`Currently configured for platform: ${config.platform} with league: ${config.league}`);
        } else {
            await say('League not configured!');
        }
    } else {
        let options = command.text.split(' ');
        if (options.length != 2) {
            await say('Invalid arguments for command!');
            return;
        }
        let platform = options[0].toLowerCase();
        let leagueId = options[1].toLowerCase();
        if (platform !== "espn" && platform !== "sleeper") {
            await say('Invalid platform!');
            return;
        }
        let exists = false;
        if (platform === "espn") {
            exists = await espn.validateLeague(leagueId, apiConfiguration);
        } else {
            exists = await sleeper.validateLeague(leagueId);
        }
        if (!exists) {
            await say('League does not exist!');
            return;
        }
        await servers.deleteLeagueRelation(db, command.channel_id, leagueId);
        let status = await servers.setConfigForServer(db, command.channel_id, platform, leagueId);
        if (!status) {
            await say('Server does not exist!');
        } else {
            await say('Successfully configured bot!');
        }
    }
    return;
});

app.command('/league', async ({command, ack, say}) => {
    await ack();
    let { service, platform, leagueId } = await validateConfiguration(say, command.channel_id);
    if (service === null || platform === '' || leagueId === '') {
        return;
    }
    let leagueInfo = await service.leagueInfo(leagueId, apiConfiguration);
    let reply = messenger.getLeagueInfo(leagueInfo);
    await say(reply);
    return;
});

app.command('/roster', async ({command, ack, say}) => {
    await ack();
    let { service, platform, leagueId } = await validateConfiguration(say, command.channel_id);
    if (service === null || platform === '' || leagueId === '') {
        return;
    }
    let team = command.text;
    let leagueInfo = await service.leagueInfo(leagueId, apiConfiguration);

    // check if team actually exists
    let targetTeam = null;
    for (let t of leagueInfo.teams) {
        if (t.nickname.toLowerCase() === team.toLowerCase()) {
            targetTeam = t;
        }
    }
    if (targetTeam === null) {
        await say('Argument given does not match any team!');
        return;
    }

    let roster = await service.roster(leagueId, targetTeam, apiConfiguration);
    let reply = messenger.getRoster(targetTeam, roster);
    await say(reply);
    return;
});

app.command('/standings', async ({command, ack, say}) => {
    await ack();
    let { service, platform, leagueId } = await validateConfiguration(say, command.channel_id);
    if (service === null || platform === '' || leagueId === '') {
        return;
    }
    let standings = await service.standings(leagueId, apiConfiguration);
    let reply = messenger.getStandings(standings);
    await say(reply);
});

app.command('/schedule', async ({command, ack, say}) => {
    await ack();
    let options = command.text.split(' ');
    if (options.length != 2) {
        await say('Invalid arguments for command!');
        return;
    }

    let { service, platform, leagueId } = await validateConfiguration(say, command.channel_id);
    if (service === null || platform === '' || leagueId === '') {
        return;
    }

    // manual argument validation (two options: 'team' and 'week')
    if (options[0].toLowerCase() == 'team') {
        if (platform === 'sleeper') {
            await say('Team schedules not supported yet for Sleeper leagues :(');
            return;
        }
        let userSchedule = await service.teamSchedule(leagueId, options[1], apiConfiguration);
        if (userSchedule.length === 0) {
            await say('Invalid team!');
            return;
        }
        let reply = messenger.getTeamSchedule(userSchedule);
        await say(reply);
    } else if (options[0].toLowerCase() == 'week') {
        let weekSchedule = await service.weekSchedule(leagueId, options[1], apiConfiguration);
        if (weekSchedule.length === 0) {
            await say('Invalid week!');
            return;
        }
        let reply = messenger.getWeekSchedule(weekSchedule);
        await say(reply);
    } else {
        await say('Invalid option!');
    }
    return;
});

(async () => {
    await app.start();
    console.log('App running!');
})();
