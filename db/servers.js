module.exports = {

    getConfigForServer: async function(db, serverId) {
        let res = await db.any('SELECT * FROM Servers WHERE server = $1', [serverId])
            .then(function(data) {
                if (data.length > 0) {
                    return data[0];
                } else {
                    return null;
                }
            })
            .catch(function(error) {
                console.log(error);
                return null;
            });
        return res;
    },

    setConfigForServer: async function(db, serverId, platform, leagueId) {
        let res = await db.none('INSERT INTO Servers(server, platform, league) VALUES($1, $2, $3)', [serverId, platform, leagueId])
            .then(function() {
                return true;
            })
            .catch(function(error) {
                console.log(error);
                return false;
            });
        return res;
    },

    deleteLeagueRelation: async function(db, serverId) {
        let res = await db.any('DELETE FROM Servers WHERE server = $1', [serverId])
            .then(function() {
                return true;
            })
            .catch(err => {
                console.log(err);
                return false;
            });
        return res;
    }

}
