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

    constructor(id, location, name, abbrev) {
        this.id = id;
        this.location = location;
        this.name = name;
        this.abbrev = abbrev;
    }

}

module.exports = {League, Team}