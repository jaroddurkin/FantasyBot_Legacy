const fantasy = require('../../services/objects');

describe('class structures', () => {

    const LEAGUE_ID = '123';
    const LEAGUE_NAME = 'League';
    const TEAM_ID = '1';
    const TEAM_NAME = 'Team Player';
    const TEAM_NICKNAME = 'TEAM';
    const PLAYER_NAME = 'Joe Football';
    const PLAYER_ID = '1';
    const PLAYER_NFL_TEAM = 'Eagles (PHI)';
    const PLAYER_POSITION = 'QB';
    const PLAYER_INJURY = 'Active'

    let league;
    let team;
    let player;
    let game;

    beforeEach(() => {
        league = new fantasy.League(LEAGUE_ID, LEAGUE_NAME);
        team = new fantasy.Team(TEAM_ID, TEAM_NAME, TEAM_NICKNAME);
        player = new fantasy.Player(PLAYER_NAME, PLAYER_ID, PLAYER_NFL_TEAM, PLAYER_POSITION, PLAYER_INJURY);
        game = new fantasy.Game(team, 200, new fantasy.Team('1', 'Fantasy Football', 'FAN'), 150, '1');
    });

    // simple tests for constructors, these definitely shouldn't fail

    test('league constructor works', () => {
        expect(league.id).toBe(LEAGUE_ID);
        expect(league.name).toBe(LEAGUE_NAME);
        expect(league.numTeams).toBe(0);
        expect(league.teams.length).toBe(0);
    });

    test('team constructor works', () => {
        expect(team.id).toBe(TEAM_ID);
        expect(team.name).toBe(TEAM_NAME);
        expect(team.nickname).toBe(TEAM_NICKNAME);
        expect(team.roster.length).toBe(0);
    });

    test('player constructor works', () => {
        expect(player.name).toBe(PLAYER_NAME);
        expect(player.id).toBe(PLAYER_ID);
        expect(player.nflTeam).toBe(PLAYER_NFL_TEAM);
        expect(player.position).toBe(PLAYER_POSITION);
        expect(player.injuryStatus).toBe(PLAYER_INJURY);
    });

    test('game constructor works', () => {
        expect(game.homeTeam.nickname).toBe('TEAM');
        expect(game.awayTeam.nickname).toBe('FAN');
        expect(game.week).toBe('1');
        expect(game.homePoints).toBe(200);
        expect(game.awayPoints).toBe(150);
        expect(game.winner).toBe('TEAM');
    });

    // test other methods within these classes

    test('player is added to team', () => {
        team.addPlayer(player);
        expect(team.roster.length).toBe(1);
        expect(team.roster[0].id).toBe(PLAYER_ID);
    });

    test('roster is overwritten', () => {
        team.setRoster([player, player, player]);
        expect(team.roster.length).toBe(3);
        expect(team.roster[1].id).toBe(PLAYER_ID);
    });

    test('team is added to league', () => {
        league.addTeam(team);
        expect(league.numTeams).toBe(1);
        expect(league.teams.length).toBe(1);
        expect(league.teams[0].id).toBe(TEAM_ID);
    });
})