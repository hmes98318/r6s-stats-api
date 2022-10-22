const cheerio = require('cheerio');
const { exec } = require('child_process');
const filterArray = require('./modules/filterarray');

module.exports = function (url) {
  let result = [];
  return new Promise(function (resolve, reject) {
    exec(`curl --max-time 5 --url ${url}`, (error, stdout, stderr) => {
      if (!stdout) {
        result[0] = 'timeout';
        resolve(result);
      } else {
        let rank = [];
        let profile = [];

        let $ = cheerio.load(stdout);

        $('#profile .r6-season__stats').each(function (i, elem) {
          rank.push(filterArray($(this).text().split('\n')));
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
          resolve(result);
        }

        result.push(rank[0]);

        for (var i = 0; i < profile.length; i++) {
          if (profile[i].indexOf('Ranked') !== -1) result.push(profile[i]);
        }

        //console.log(profile);
        //console.log(result);

        if (error !== null) {
          reject(error);
        }
        resolve(result);
      }
    });
  });
};
