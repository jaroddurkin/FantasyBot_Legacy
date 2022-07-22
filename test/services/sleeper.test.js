const { sendRequest } = require('../../services/sleeper/init');
const sleeper = require('../../services/sleeper/sleeper');

const mockLeagueResponse = require('../mock/sleeper/league.json');
const mockMatchupsResponse = require('../mock/sleeper/matchups.json');
const mockRostersResponse = require('../mock/sleeper/rosters.json');
const mockUsersResponse = require('../mock/sleeper/users.json');

jest.mock('../../services/sleeper/init', () => {
    const actual = jest.requireActual('../../services/sleeper/init');
    return {
        ...actual,
        sendRequest: jest.fn()
    };
});

describe('sleeper service', () => {

    test('validate league exists', async () => {
        sendRequest.mockReturnValue(mockLeagueResponse);
        const leagueExists = await sleeper.validateLeague('123');
        expect(leagueExists).toBe(true);
    });

    test('validate league does not exist', async () => {
        sendRequest.mockReturnValue({});
        const leagueExists = await sleeper.validateLeague('321');
        expect(leagueExists).toBe(false);
    });

    test('league info returns all teams', async () => {
        sendRequest.mockReturnValueOnce(mockLeagueResponse).mockReturnValueOnce(mockUsersResponse).mockReturnValueOnce(mockRostersResponse);
        const league = await sleeper.leagueInfo('123');
        expect(league.numTeams).toBe(2);
        expect(league.teams.length).toBe(2);
        expect(league.teams[0].name).toBe('Team Player');
        expect(league.teams[1].name).toBe('Team Fantasy');
    });

    test('roster returns players', async () => {
        sendRequest.mockReturnValueOnce(mockUsersResponse).mockReturnValueOnce(mockRostersResponse);
        const roster = await sleeper.roster('123', 'Player');
        expect(roster.length).toBeGreaterThan(0);
        expect(roster[0].id).toBe('1266');
        expect(roster[1].id).toBe('2320');
    });

    test('standings are correct', async () => {
        sendRequest.mockReturnValueOnce(mockUsersResponse).mockReturnValueOnce(mockRostersResponse);
        const standings = await sleeper.standings('123');
        expect(standings[1].W).toBe(11);
        expect(standings[2].W).toBe(9);
        expect(standings[1].GB).toBe(0);
        expect(standings[2].GB).toBe(2);
    });

    test('get schedule for entire league', async () => {
        sendRequest.mockReturnValueOnce(mockLeagueResponse).mockReturnValueOnce(mockUsersResponse).mockReturnValueOnce(mockRostersResponse).mockReturnValueOnce(mockMatchupsResponse);
        const schedule = await sleeper.weekSchedule('123', '1');
        expect(schedule.length).toBe(1);
        expect(schedule[0].winner).toBe('Fantasy');
        expect(schedule[0].week).toBe('1');
    });
})