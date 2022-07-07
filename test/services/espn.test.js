const axios = require('axios');
const espn = require('../../services/espn');

const mockLeagueResponse = require('../mock/espn/league.json');
const mockMatchupResponse = require('../mock/espn/matchup.json');
const mockRosterResponse = require('../mock/espn/roster.json');
const mockTeamResponse = require('../mock/espn/team.json');

jest.mock('axios');

describe('espn service', () => {
    
    test('validate league', () => {
        expect(true).toBe(true);
    });
})