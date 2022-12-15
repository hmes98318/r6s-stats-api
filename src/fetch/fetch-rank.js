const cheerio = require('cheerio');
const exec = require('./modules/exec-fetch');
const filterArray = require('./modules/filterarray');


module.exports = async function (url) {
    let result = [];
    let rank = [];
    let profile = [];

    const data = await exec(url);

    if (!data) {
        result[0] = 'timeout';
        return result;
    }

    const $ = cheerio.load(data);

    $('#profile .r6-season__stats').each(function (i, elem) {
        rank.push(filterArray($(this).text().split('\n')));
    });

    $('#profile .trn-card').each(function (i, elem) {
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

    result.push(rank[0]);

    for (var i = 0; i < profile.length; i++) {
        if (profile[i].indexOf('Ranked') !== -1) result.push(profile[i]);
    }

    //console.log(profile);
    //console.log(result);

    return result;
};