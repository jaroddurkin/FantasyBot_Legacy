const messenger = require('../../formatters/SlackMessenger');
const fantasy = require('../../services/objects');

describe('slack messenger', () => {

    test('league info command with multiple teams', () => {
        let league = new fantasy.League('12345678', 'League');
        league.addTeam(new fantasy.Team('1', 'Team', 'Player', 'TEAM'));
        league.addTeam(new fantasy.Team('2', 'Fantasy', 'Football', 'FAN'));
        const message = messenger.getLeagueInfo(league);
        expect(message.blocks.length).toBe(3);
        expect(message.blocks[0].text.text).toBe("Teams in League");
        expect(message.blocks[1].text.text).toBe("*TEAM*\nTeam Player");
    });

    test('league info command with no teams', () => {
        let league = new fantasy.League('12345678', 'League');
        const message = messenger.getLeagueInfo(league);
        expect(message.blocks.length).toBe(1);
        expect(message.blocks[0].text.text).toBe('Teams in League');
    });

    test('roster command with multiple players', () => {
        let team = new fantasy.Team('1', 'Team', 'Player', 'TEAM');
        let player1 = new fantasy.Player('Joe Football', '1', 'Eagles (PHI)', 'QB', 'Active');
        let player2 = new fantasy.Player('John Doe', '2', 'Rams (LAR)', 'WR', 'Questionable');
        const message = messenger.getRoster(team, [player1, player2]);
        expect(message.blocks.length).toBe(3);
        expect(message.blocks[0].text.text).toBe("Players currently on:\n*Team Player (TEAM)*");
        expect(message.blocks[1].text.text).toContain('Joe Football');
        expect(message.blocks[2].text.text).toContain('John Doe');
    });

    test('roster command with no players', () => {
        let team = new fantasy.Team('1', 'Team', 'Player', 'TEAM');
        const message = messenger.getRoster(team, []);
        expect(message.blocks.length).toBe(1);
        expect(message.blocks[0].text.text).toBe("Players currently on:\n*Team Player (TEAM)*");
    });

    test('standings command with multiple teams', () => {
        let standings = {
            1: {
                fullTeam: new fantasy.Team('1', 'Team', 'Player', 'TEAM'),
                seed: 1,
                W: 10,
                L: 6,
                T: 0,
                GB: 0,
                PF: 2000,
                PA: 1500
            },
            2: {
                fullTeam: new fantasy.Team('2', 'Fantasy', 'Football', 'FAN'),
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
        expect(message.blocks.length).toBe(3);
        expect(message.blocks[0].text.text).toBe("*Current Standings*");
        expect(message.blocks[1].text.text).toContain("Team Player");
        expect(message.blocks[2].text.text).toContain("Fantasy Football");
    });
    
    test('standings command with no teams', () => {
        const message = messenger.getStandings({});
        expect(message.blocks.length).toBe(1);
        expect(message.blocks[0].text.text).toBe("*Current Standings*");
    });

    test('team schedule command with single game', () => {
        const schedule = [
            {
                user: new fantasy.Team('1', 'Team', 'Player', 'TEAM'),
                opponent: new fantasy.Team('2', 'Fantasy', 'Football', 'FAN'),
                userPoints: 200,
                oppPoints: 150,
                gameResult: 'W',
                gameNumber: '1'
            }
        ];
        const message = messenger.getTeamSchedule(schedule);
        expect(message.blocks.length).toBe(2);
        expect(message.blocks[0].text.text).toBe("*Schedule for Team Player*");
        expect(message.blocks[1].text.text).toContain("Game 1");
    });

    test('week schedule command with single game', () => {
        const schedule = [
            {
                home: new fantasy.Team('1', 'Team', 'Player', 'TEAM'),
                away: new fantasy.Team('2', 'Fantasy', 'Football', 'FAN'),
                week: '1',
                homePoints: 200,
                awayPoints: 150,
                winner: 'TEAM'
            }
        ];
        const message = messenger.getWeekSchedule(schedule);
        expect(message.blocks.length).toBe(2);
        expect(message.blocks[0].text.text).toBe('*Schedule for Game 1*');
        expect(message.blocks[1].text.text).toContain('Fantasy Football vs. Team Player');
    });
});