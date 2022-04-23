const cheerio = require("cheerio");
const { exec } = require('child_process');
const filterArray = require('./modules/filterarray.js');


module.exports = function (url, operator) {
  return new Promise(function (resolve, reject) {
    exec(`curl ${url}`,
      (error, stdout, stderr) => {

        let rank = [];
        let profile = [];
        let result = [];

        let $ = cheerio.load(stdout);

        $('#profile .trn-table__row')
          .each(function (i, elem) {
            profile.push(filterArray($(this).text().split('\n')));
          })

        let imgurl = $('img').map(function () {
          return $(this).attr('src')
        });//console.log(imgurl.toArray());
        let header = imgurl.toArray()[0];

        result.push(header);

        if (header.indexOf("avatars") === -1 && header.indexOf("xbox") === -1) {
          result[0] = "error";
          resolve(result);
        }


        let operator_img = `https://trackercdn.com/cdn/r6.tracker.network/operators/badges/${operator.toLowerCase()}.png`;
        result.push(operator_img);


        if (operator == "NAKK")
          operator = "NØKK";
        if (operator == "JAGER")
          operator = "JÄGER";
        if (operator == "CAPITAO")
          operator = "CAPITÃO";


        result.push(profile[0]);

        for (var i = 0; i < profile.length; i++) {
          if (profile[i].indexOf(operator) !== -1)
            result.push(profile[i]);
        }


        //console.log(rank);
        //console.log(profile);
        //console.log(result);


        if (error !== null)
          reject(error);

        resolve(result);
      });
  });
}