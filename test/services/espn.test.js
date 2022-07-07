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
    });
})