const axios = require('axios');

const ESPN_SERVICE_URL = 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/';

module.exports = {

    sendRequest: async function(id, settings, config) {
        let apiConfig = {};
        // cookie will add support for private leagues
        if (config.cookie.length !== 0) {
            apiConfig['headers'] = {
                Cookie: config.cookie
            };
            apiConfig['withCredentials'] = true;
        }
        let res = await axios.get(ESPN_SERVICE_URL + id + settings, apiConfig)
            .then(function (res) {
                return res.data;
            })
            .catch(function (err) {
                return {};
            });
        return res;
    }

};
