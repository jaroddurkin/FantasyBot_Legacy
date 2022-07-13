class League {

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.numTeams = 0;
        this.teams = [];
    }

    addTeam(team) {
        this.teams.push(team);
        this.numTeams++;
    }
}

class Team {

    constructor(id, name, nickname) {
        this.id = id;
        this.name = name;
        this.nickname = nickname;
        this.roster = [];
    }

    addPlayer(player) {
        this.roster.push(player);
    }

    setRoster(playerList) {
        this.roster = playerList;
    }

}

class Player {

    constructor(name, id, nflTeam, position, injuryStatus) {
        this.name = name;
        this.id = id;
        this.nflTeam = nflTeam;
        this.position = position;
        this.injuryStatus = injuryStatus;
    }
}

module.exports = {League, Team, Player};
