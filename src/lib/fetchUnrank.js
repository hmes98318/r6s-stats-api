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
    let profile = [];

    let $ = cheerio.load(data);

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

    for (var i = 0; i < profile.length; i++) {
      if (profile[i].indexOf('UnRanked') !== -1) result.push(profile[i]);
    }

    //console.log(profile);
    //console.log(result);

    // if (error !== null) {
    //   reject(error);
    // }
    return result;
  }
};
