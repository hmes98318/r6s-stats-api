const R6 = require('./index.js');

let platform = 'pc';
let name = 'waifu_-.';
//let name = "test-wrong-name"

async function main() {
    let general = await R6.general(platform, name);
    console.log('general', general);

    let casual = await R6.casual(platform, name);
    console.log('casual', casual);

    let rank = await R6.rank(platform, name);
    console.log('rank', rank);

    let deathmatch = await R6.deathmatch(platform, name);
    console.log('deathmatch', deathmatch);

    let operator = await R6.operator(platform, name, 'ace');
    console.log('operator', operator);
}

main();
