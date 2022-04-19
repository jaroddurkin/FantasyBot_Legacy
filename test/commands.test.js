const league = require('../commands/league');
const fantasy = require('../services/objects');

test('format league with 1 team', () => {
    let mockLeague = new fantasy.League("FOO", "BAR");
    mockLeague.addTeam(new fantasy.Team("A", "B", "C", "ABC"));

    let result = league.getLeagueInfo(mockLeague);
    expect(result.title).toEqual("Teams in BAR");
    expect(result.fields.length).toEqual(1);
});