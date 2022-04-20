const R6 = require('./index.js');



var name = `waifu_-.`
//var name = `test-wrong-name`


async function main() {

  let general = await R6.general('pc', name);
  console.log("general", general);


  let casual = await R6.casual('pc', name);
  console.log("casual", casual);


  let rank = await R6.rank('pc', name);
  console.log("rank", rank);


  let unrank = await R6.unrank('pc', name);
  console.log("unrank", unrank);

  let deathmatch = await R6.deathmatch('pc', name);
  console.log("deathmatch", deathmatch);


  let operator = await R6.operator('pc', name, 'ace');
  console.log("operator", operator);

}

main();