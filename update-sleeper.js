const fs = require('fs');
const axios = require('axios');

(async () => {
    console.log('Begin refresh of sleeper player data.');
    const data = await axios.get('https://api.sleeper.app/v1/players/nfl')
        .then(function (res) {
            return res.data;
        })
        .catch(function (err) {
            return {}
        });
    if (Object.keys(data).length === 0) {
        console.log('Failed to fetch sleeper player data.');
    } else {
        fs.writeFileSync('./services/sleeper/playerData.json', JSON.stringify(data));
        console.log('Successfully fetched sleeper player data.');
    }
})();
