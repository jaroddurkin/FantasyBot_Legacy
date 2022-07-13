const { sendRequest } = require('../../services/espn/init');
const espn = require('../../services/espn/espn');

const mockLeagueResponse = require('../mock/espn/league.json');
const mockMatchupResponse = require('../mock/espn/matchup.json');
const mockRosterResponse = require('../mock/espn/roster.json');
const mockTeamResponse = require('../mock/espn/team.json');

const requestOptions = {cookie: ''};

jest.mock('../../services/espn/init', () => {
    const actual = jest.requireActual('../../services/espn/init');
    return {
        ...actual,
        sendRequest: jest.fn()
    };
});

describe('espn service', () => {
    
    test('validate league exists', async () => {
        sendRequest.mockReturnValue(mockLeagueResponse);
        const leagueExists = await espn.validateLeague('12345678', requestOptions);
        expect(leagueExists).toBe(true);
    });

    test('validate league does not exist', async () => {
        sendRequest.mockReturnValue({});
        const leagueExists = await espn.validateLeague('87654321', requestOptions);
        expect(leagueExists).toBe(false);
    });

    test('league info returns all teams', async () => {
        sendRequest.mockReturnValue(mockLeagueResponse);
        const league = await espn.leagueInfo('12345678', requestOptions);
        expect(league.numTeams).toBe(2);
        expect(league.teams.length).toBe(2);
        expect(league.teams[0].nickname).toBe('TEAM');
        expect(league.teams[1].nickname).toBe('FAN');
    });

    test('roster returns players', async () => {
        sendRequest.mockReturnValue(mockRosterResponse);
        const team = { id: 1 };
        const roster = await espn.roster('12345678', requestOptions, team);
        expect(roster.length).toBeGreaterThan(0);
        expect(roster[0].name).toBe("Christian McCaffrey");
    });

    test('standings are correct', async () => {
        sendRequest.mockReturnValue(mockTeamResponse);
        const standings = await espn.standings('12345678', requestOptions);
        expect(standings[1].W).toBe(3);
        expect(standings[1].seed).toBe(9);
        expect(standings[2].W).toBe(7);
        expect(standings[2].seed).toBe(6);
    });

    test('get schedule for team', async () => {
        sendRequest.mockReturnValueOnce(mockLeagueResponse).mockReturnValue(mockMatchupResponse);
        const schedule = await espn.teamSchedule('12345678', requestOptions, 'TEAM');
        expect(schedule.length).toBe(1);
        expect(schedule[0].gameResult).toBe('L');
        expect(schedule[0].gameNumber).toBe(1);
    });

    test('get schedule for other team', async () => {
        sendRequest.mockReturnValueOnce(mockLeagueResponse).mockReturnValue(mockMatchupResponse);
        const schedule = await espn.teamSchedule('12345678', requestOptions, 'FAN');
        expect(schedule.length).toBe(1);
        expect(schedule[0].gameResult).toBe('W');
        expect(schedule[0].gameNumber).toBe(1);
    });

    test('get schedule for entire league', async () => {
        sendRequest.mockReturnValueOnce(mockLeagueResponse).mockReturnValue(mockMatchupResponse);
        const schedule = await espn.weekSchedule('12345678', requestOptions, '1');
        expect(schedule.length).toBe(1);
        expect(schedule[0].winner).toBe('FAN');
        expect(schedule[0].week).toBe('1');
    });
});