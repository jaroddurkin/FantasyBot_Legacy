const crypt = require('./crypt');

module.exports = {

    getConfigForServer: async function(db, serverId) {
        let res = await db.any('SELECT * FROM Servers WHERE server = $1', [serverId])
            .then(function(data) {
                if (data.length > 0) {
                    let server = data[0];
                    if (server.cred.length !== 0) {
                        let hash = server.cred.split('|');
                        server.cred = crypt.decrypt({iv: hash[0], content: hash[1]})
                    }
                    return server;
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

    setConfigForServer: async function(db, serverId, platform, leagueId, cred) {
        if (cred.length !== 0) {
            let e = crypt.encrypt(cred);
            cred = `${e.iv}|${e.content}`;
        }
        let res = await db.none('INSERT INTO Servers(server, platform, league, cred) VALUES($1, $2, $3, $4)', [serverId, platform, leagueId, cred])
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
