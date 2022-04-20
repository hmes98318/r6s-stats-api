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
        /*
        $('#profile .trn-card')
          .each(function(i, elem) {
            profile.push(filterArray($(this).text().split('\n')));
          })
        */

        result.push(rank[2]);
        /*
        for(var i = 0; i < profile.length; i++){
            if(profile[i].indexOf("Ranked") !== -1)
              result.push(profile[i]);
        }
        */

        //console.log(rank);
        //console.log(result);

        if (!result[0])
          result[0] = "error";

        if (error !== null) {
          reject(error);
        }
        resolve(result);
      });
  });
}