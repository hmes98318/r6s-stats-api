const cheerio = require("cheerio");
const { exec } = require('child_process');
const filterArray = require('./modules/filterarray.js');


module.exports = function (url) {
  return new Promise(function (resolve, reject) {
    exec(`curl ${url}`,
      (error, stdout, stderr) => {

        let rank = [];
        let profile = [];
        let result = [];

        let $ = cheerio.load(stdout);

        $('#profile .r6-season__stats')
          .each(function (i, elem) {
            rank.push(filterArray($(this).text().split('\n')));
          })

        let imgurl = $('img').map(function () {
          return $(this).attr('src')
        });//console.log(imgurl.toArray());
        let header = imgurl.toArray()[0];

        result.push(header);

        if (header.indexOf("ubisoft-avatars") === -1) {
          result[0] = "error";
          resolve(result);
        }


        result.push(rank[2]);


        //console.log(profile);
        //console.log(result);


        if (error !== null) {
          reject(error);
        }
        resolve(result);
      });
  });
}