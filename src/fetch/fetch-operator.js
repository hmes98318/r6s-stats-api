const cheerio = require('cheerio');
const exec = require('./modules/exec-fetch');
const filterArray = require('./modules/filterarray');


module.exports = async function (url, operator) {
    let result = [];
    let profile = [];

    const data = await exec(url);

    if (!data) {
        result[0] = 'timeout';
        return result;
    }

    const $ = cheerio.load(data);

    $('#profile .trn-table__row').each(function (i, elem) {
        profile.push(filterArray($(this).text().split('\n')));
    });

    let imgurl = $('img').map(function () {
        return $(this).attr('src');
    });
    let header = imgurl.toArray()[0];
    result.push(header);

    if (header.indexOf('avatars') === -1 && header.indexOf('xbox') === -1) {
        result[0] = 'error';
        return result;
    }

    let operator_img = `https://trackercdn.com/cdn/r6.tracker.network/operators/badges/${operator.toLowerCase()}.png`;
    result.push(operator_img);

    if (operator == 'NAKK') operator = 'NØKK';
    if (operator == 'JAGER') operator = 'JÄGER';
    if (operator == 'CAPITAO') operator = 'CAPITÃO';

    result.push(profile[0]);

    for (var i = 0; i < profile.length; i++) {
        if (profile[i].indexOf(operator) !== -1) result.push(profile[i]);
    }

    //console.log('profile',profile);
    //console.log('result',result);

    if (result.length < 4) {
        result[0] = 'operator_error';
        return result;
    }

    return result;
};