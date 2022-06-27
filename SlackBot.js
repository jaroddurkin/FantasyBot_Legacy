const { App } = require('@slack/bolt');
const pgp = require('pg-promise')();

const espn = require('./services/espn');
const messenger = require('./formatters/SlackMessenger');
const init_db = require('./db/init');
const servers = require('./db/servers');

const db = pgp(process.env.PG_CONNECTION);

if (!init_db.createTablesIfNotExist(db)) {
    process.exit(1);
}

const app = new App({
    token: process.env.SLACK_TOKEN,
    appToken: process.env.SLACK_APPTOKEN,
    socketMode: true
});

app.command('/ping', async ({command, ack, say}) => {
    await ack();
    await say('Pong!');
});

app.command("/config", async ({command, ack, say}) => {
    await ack();
    if (command.text.length === 0) {
        let league = await servers.getLeagueFromServer(db, command.channel_id);
        if (league != null) {
            await say(`League ID currently configured: ${league}`);
            return;
        } else {
            await say('League not configured!');
            return;
        }
    } else {
        let leagueId = command.text;
        let exists = await espn.validateLeague(leagueId, process.env.COOKIE_VALUE);
        if (!exists) {
            await say('League does not exist!');
            return;
        }
        await servers.deleteLeagueRelation(db, command.channel_id, leagueId);
        let status = await servers.setLeagueForServer(db, command.channel_id, leagueId);
        if (!status) {
            await say('Server does not exist!');
            return;
        } else {
            await say('League ID set!');
            return;
        }
    }
});

app.command('/league', async ({command, ack, say}) => {
    await ack();
    let leagueId = await servers.getLeagueFromServer(db, command.channel_id);
    if (leagueId == null) {
        await say('Please configure this bot using /config');
        return;
    }
    let leagueInfo = await espn.leagueInfo(leagueId, process.env.COOKIE_VALUE);
    let reply = messenger.getLeagueInfo(leagueInfo);
    await say(reply);
});

app.command('/roster', async ({command, ack, say}) => {
    await ack();
    let leagueId = await servers.getLeagueFromServer(db, command.channel_id);
    if (leagueId == null) {
        await say('Please configure this bot using /config');
        return;
    }
    let team = command.text;
    let leagueInfo = await espn.leagueInfo(leagueId, process.env.COOKIE_VALUE);
    let targetTeam = null;
    for (let t of leagueInfo.teams) {
        if (t.abbrev.toLowerCase() === team.toLowerCase()) {
            targetTeam = t;
        }
    }
    if (targetTeam === null) {
        await say('Argument given does not match any team!');
        return;
    }
    let roster = await espn.roster(leagueId, process.env.COOKIE_VALUE, targetTeam);
    let reply = messenger.getRoster(targetTeam, roster);
    await say(reply);
});

app.command('/standings', async ({command, ack, say}) => {
    await ack();
    let leagueId = await servers.getLeagueFromServer(db, command.channel_id);
    if (leagueId == null) {
        await say('Please configure this bot using /config');
        return;
    }
    let standings = await espn.standings(leagueId, process.env.COOKIE_VALUE);
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

    let leagueId = await servers.getLeagueFromServer(db, command.channel_id);
    if (leagueId == null) {
        await say('Please configure this bot using /config');
        return;
    }

    if (options[0] == 'team') {
        let userSchedule = await espn.teamSchedule(leagueId, process.env.COOKIE_VALUE, options[1]);
        if (userSchedule.length === 0) {
            await say('Invalid team!');
            return;
        }
        let reply = messenger.getTeamSchedule(userSchedule);
        await say(reply);
    } else if (options[0] == 'week') {
        let weekSchedule = await espn.weekSchedule(leagueId, process.env.COOKIE_VALUE, options[1]);
        if (weekSchedule.length === 0) {
            await say('Invalid week!');
            return;
        }
        let reply = messenger.getWeekSchedule(weekSchedule);
        await say(reply);
    } else {
        await say('Invalid option!');
    }
});

(async () => {
    await app.start();
    console.log('App running!');
})();
