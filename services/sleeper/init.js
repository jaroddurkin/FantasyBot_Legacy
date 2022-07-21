const axios = require('axios');

const SLEEPER_SERVICE_URL = 'https://api.sleeper.app/v1/league/';

module.exports = {

    sendRequest: async function(id, settings) {
        let res = await axios.get(SLEEPER_SERVICE_URL + id + settings)
            .then(function (res) {
                return res.data;
            })
            .catch(function (err) {
                return {};
            });
        return res;
    }
}