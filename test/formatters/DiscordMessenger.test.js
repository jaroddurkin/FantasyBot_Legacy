const messenger = require('../../formatters/DiscordMessenger');
const fantasy = require('../../services/objects');

describe('discord messenger', () => {

    test('league info command with multiple teams', () => {
        let league = new fantasy.League('12345678', 'League');
        league.addTeam(new fantasy.Team('1', 'Team Player', 'TEAM'));
        league.addTeam(new fantasy.Team('2', 'Fantasy Football', 'FAN'));
        const message = messenger.getLeagueInfo(league);
        expect(message.title).toBe("Teams in League");
        expect(message.fields.length).toBe(2);
        expect(message.fields[0].name).toBe('TEAM');
    });

    test('league info command with no teams', () => {
        let league = new fantasy.League('12345678', 'League');
        const message = messenger.getLeagueInfo(league);
        expect(message.title).toBe("Teams in League");
        expect(message.fields.length).toBe(0);
    });

    test('roster command with multiple players', () => {
        let team = new fantasy.Team('1', 'Team Player', 'TEAM');
        let player1 = new fantasy.Player('Joe Football', '1', 'Eagles (PHI)', 'QB', 'Active');
        let player2 = new fantasy.Player('John Doe', '2', 'Rams (LAR)', 'WR', 'Questionable');
        const message = messenger.getRoster(team, [player1, player2]);
        expect(message.title).toBe("Players currently on Team Player (TEAM)");
        expect(message.fields.length).toBe(2);
        expect(message.fields[0].name).toBe('Joe Football');
        expect(message.fields[1].name).toBe('John Doe');
    });

    test('roster command with no players', () => {
        let team = new fantasy.Team('1', 'Team Player', 'TEAM');
        const message = messenger.getRoster(team, []);
        expect(message.title).toBe("Players currently on Team Player (TEAM)");
        expect(message.fields.length).toBe(0);
    });

    test('standings command with multiple teams', () => {
        let standings = {
            1: {
                fullTeam: new fantasy.Team('1', 'Team Player', 'TEAM'),
                seed: 1,
                W: 10,
                L: 6,
                T: 0,
                GB: 0,
                PF: 2000,
                PA: 1500
            },
            2: {
                fullTeam: new fantasy.Team('2', 'Fantasy Football', 'FAN'),
                seed: 2,
                W: 6,
                L: 10,
                T: 0,
                GB: 4,
                PF: 1500,
                PA: 2000
            }
        }
        const message = messenger.getStandings(standings);
        expect(message.title).toBe("Current standings");
        expect(message.fields.length).toBe(2);
        expect(message.fields[0].name).toBe('Team Player (TEAM)');
        expect(message.fields[1].name).toBe('Fantasy Football (FAN)');
    });

    test('standings command with no teams', () => {
        const message = messenger.getStandings({});
        expect(message.title).toBe("Current standings");
        expect(message.fields.length).toBe(0);
    });

    test('team schedule command with single game', () => {
        const schedule = [
            {
                user: new fantasy.Team('1', 'Team Player', 'TEAM'),
                opponent: new fantasy.Team('2', 'Fantasy Football', 'FAN'),
                userPoints: 200,
                oppPoints: 150,
                gameResult: 'W',
                gameNumber: '1'
            }
        ];
        const message = messenger.getTeamSchedule(schedule);
        expect(message.title).toBe('Schedule for Team Player');
        expect(message.fields.length).toBe(1);
        expect(message.fields[0].name).toBe('Game: 1');
    });

    test('week schedule command with single game', () => {
        const schedule =[
            {
                home: new fantasy.Team('1', 'Team Player', 'TEAM'),
                away: new fantasy.Team('2', 'Fantasy Football', 'FAN'),
                week: '1',
                homePoints: 200,
                awayPoints: 150,
                winner: 'TEAM'
            }
        ];
        const message = messenger.getWeekSchedule(schedule);
        expect(message.title).toBe('Schedule for Game 1');
        expect(message.fields.length).toBe(1);
        expect(message.fields[0].name).toBe('Fantasy Football vs. Team Player')
    });
})