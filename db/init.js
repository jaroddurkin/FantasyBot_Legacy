module.exports = {

    createTablesIfNotExist: async function(db) {
        let res = await db.none('CREATE TABLE IF NOT EXISTS Servers(server text not null, league text not null);')
            .then(() => {
                return true;
            })
            .catch(err => {
                console.log(err);
                return false;
            });
        return res;
    }

}
