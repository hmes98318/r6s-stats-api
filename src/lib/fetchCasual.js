const cheerio = require('cheerio');
const axios = require('axios');
const filterArray = require('./modules/filterarray');

module.exports = async function (url) {
  let result = [];

  const { data } = await axios({
    method: 'get',
    url,
    timeout: 5000,
  });

  if (!data) {
    result[0] = 'timeout';
    return result;
  } else {
    let rank = [];
    let profile = [];

    let $ = cheerio.load(data);

    $('#profile .r6-season__stats').each(function (i, elem) {
      rank.push(filterArray($(this).text().split('\n')));
    });

    $('#profile .trn-card').each(function (i, elem) {
      profile.push(filterArray($(this).text().split('\n')));
    });

    $('#profile .trn-card').each(function (i, elem) {
      profile.push(filterArray($(this).text().split('\n')));
    });

    let imgurl = $('img').map(function () {
      return $(this).attr('src');
    }); //console.log(imgurl.toArray());
    let header = imgurl.toArray()[0];

    result.push(header);

    if (header.indexOf('avatars') === -1 && header.indexOf('xbox') === -1) {
      result[0] = 'error';
      return result;
    }

    result.push(rank[1]);

    for (var i = 0; i < profile.length; i++) {
      if (profile[i].indexOf('Unranked And Casual') !== -1)
        result.push(profile[i]);
    }

    //console.log(rank);
    //console.log(profile);
    //console.log(result);

    // if (error !== null) reject(error);

    return result;
  }
};
