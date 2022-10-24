const axios = require('axios');
const agent = require('./random-agent');

module.exports = async function (url) {

    const { data } = await axios({
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'text/html',
            'accept-encoding': 'deflate',
            'accept-language': 'en-US,en;q=0.8,et;q=0.6',
            'cache-control': 'max-age=0',
            'User-Agent': agent()
        },
        timeout: 5000,
    })
        .catch((error) => { return error; });

    return data;
}


