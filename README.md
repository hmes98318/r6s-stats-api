# r6s-stats-api
### An api for fetching player statistics from Rainbow Six Siege

### Notice  
**this api depends on the `bash`**  
**normal work on `Linux` `Max OS`**  
**`Windows` need to install [`WSL`](https://docs.microsoft.com/en-us/windows/wsl/install) or [`git bash`](https://git-scm.com/download/win)**

## Installation  
```
$ npm i r6s-stats-api
```


## Valid Parameters  



[**general()**](https://github.com/hmes98318/r6s-stats-api#generalplatform-string-namestring)  
> `url`,`name`,`header`,`level`,  
> `kd`,`kills`,`deaths`,`win_`,`wins`,`losses`,`headshot_`,`headshots`,  
> `time_played`,`matches_played`,`total_xp`,`melee_kills`,`blind_kills`  

[**casual()**](https://github.com/hmes98318/r6s-stats-api#casualplatform-string-namestring)  
> `url`,`name`,`header`,  
> `kd`,`kills`,`deaths`,`win_`,`wins`,`losses`,  
> `time_played`,`matches`,`kills_match`,`kills_min`,`mmr`,`rank`,`rank_img`  


[**rank()**](https://github.com/hmes98318/r6s-stats-api#rankplatform-string-namestring)  
> `url`,`name`,`header`,  
> `kd`,`kills`,`deaths`,`win_`,`wins`,`losses`,  
> `time_played`,`matches`,`kills_match`,`kills_min`,`mmr`,`rank`,`rank_img`  


[**unrank()**](https://github.com/hmes98318/r6s-stats-api#unrankplatform-string-namestring)  
> `url`,`name`,`header`,  
> `kd`,`kills`,`deaths`,`win_`,`wins`,`losses`,  
> `time_played`,`matches`,`kills_match`,`kills_min`  


[**deathmatch()**](https://github.com/hmes98318/r6s-stats-api#deathmatchplatform-string-namestring)  
> `url`,`name`,`header`,  
> `kd`,`kills`,`deaths`,`win_`,`wins`,`losses`,`abadons`,  
> `matches`,`kills_match`,`mmr`,`rank`,`rank_img`  


[**operator()**](https://github.com/hmes98318/r6s-stats-api#operatorplatform-string-namestring-operatorstring)  
> `url`,`name`,`header`,  
> `kd`,`kills`,`deaths`,`win_`,`wins`,`losses`,`headshots_`,  
> `time_played`,`operator`,`operator_img`,`melee_kills`,`operator_stat`,`dbnos`,`xp`  



## Example Usage  

### general(platform `string`, name`string`)
```js
const R6 = require('r6s-stats-api');

let name = `waifu_-.`
let platform = 'pc';

async function main() {
  let general = await R6.general(platform, name);
  console.log("general", general);
}
main();
/*
OUTPUT:
general Stats {
  url: 'https://r6.tracker.network/profile/pc/waifu_-./',
  name: 'waifu_-.',
  header: 'https://ubisoft-avatars.akamaized.net/c5724a1b-374a-4a7e-898d-9f271ceb152f/default_256_256.png',
  level: '205',
  kd: '1.32',
  kills: '13,784',
  deaths: '10,470',
  win_: '53%',
  wins: '1,810',
  losses: '1,602',
  headshot_: '39.45%',
  headshots: '5,438',
  time_played: '790h',
  matches_played: '3,415',
  total_xp: '35,359,675',
  melee_kills: '178',
  blind_kills: '28'
}
*/
```

### casual(platform `string`, name`string`)
```js
let name = `waifu_-.`
let platform = 'pc';

async function main() {
  let casual = await R6.casual(platform, name);
  console.log("casual", casual);
}
main();
/*
OUTPUT:
casual Stats {
  url: 'https://r6.tracker.network/profile/pc/waifu_-./',
  name: 'waifu_-.',
  header: 'https://ubisoft-avatars.akamaized.net/c5724a1b-374a-4a7e-898d-9f271ceb152f/default_256_256.png',
  kd: '1.35',
  kills: '12,430',
  deaths: '9,190',
  win_: '53.5%',
  wins: '1,652',
  losses: '1,435',
  time_played: '711h 45m 6s',
  matches: '3,087',
  kills_match: '4.03',
  kills_min: '0.29',
  mmr: '3,571',
  rank: 'PLATINUM II',
  rank_img: 'https://imgur.com/YrDuNNC.png'
}
*/
```

### rank(platform `string`, name`string`)
```js
let name = `waifu_-.`
let platform = 'pc';

async function main() {
  let rank = await R6.rank(platform, name);
  console.log("rank", rank);
}
main();
/*
OUTPUT:
rank Stats {
  url: 'https://r6.tracker.network/profile/pc/waifu_-./',
  name: 'waifu_-.',
  header: 'https://ubisoft-avatars.akamaized.net/c5724a1b-374a-4a7e-898d-9f271ceb152f/default_256_256.png',
  kd: '1.05',
  kills: '507',
  deaths: '485',
  win_: '54.8%',
  wins: '68',
  losses: '56',
  time_played: '38h 47m 38s',
  matches: '124',
  kills_match: '4.09',
  kills_min: '0.22',
  mmr: '2,500',
  rank: '-',
  rank_img: 'https://imgur.com/PvLQN8r.png'
}
*/
```

### unrank(platform `string`, name`string`)
```js
let name = `waifu_-.`
let platform = 'pc';

async function main() {
  let unrank = await R6.unrank(platform, name);
  console.log("unrank", unrank);
}
main();
/*
OUTPUT:
unrank Stats {
  url: 'https://r6.tracker.network/profile/pc/waifu_-./',
  name: 'waifu_-.',
  header: 'https://ubisoft-avatars.akamaized.net/c5724a1b-374a-4a7e-898d-9f271ceb152f/default_256_256.png',
  kd: ' 1.07',
  kills: '847',
  deaths: '795',
  win_: '44.8%',
  wins: '90',
  losses: '111',
  time_played: '39h 41m 4s',
  matches: '201',
  kills_match: '4.21',
  kills_min: '0.36'
}
*/
```

### deathmatch(platform `string`, name`string`)
```js
let name = `waifu_-.`
let platform = 'pc';

async function main() {
  let deathmatch = await R6.deathmatch(platform, name);
  console.log("deathmatch", deathmatch);
}
main();
/*
OUTPUT:
deathmatch Stats {
  url: 'https://r6.tracker.network/profile/pc/waifu_-./',
  name: 'waifu_-.',
  header: 'https://ubisoft-avatars.akamaized.net/c5724a1b-374a-4a7e-898d-9f271ceb152f/default_256_256.png',
  kd: '1.22',
  kills: '128',
  deaths: '105',
  win_: '36.36',
  wins: '4',
  losses: '7',
  abandons: '0',
  matches: '11',
  kills_match: '11.64',
  mmr: '2,733',
  rank: 'GOLD III',
  rank_img: 'https://imgur.com/hQzavB2.png'
}
*/
```

### operator(platform `string`, name`string`, operator`string`)
```js
let name = `waifu_-.`
let platform = 'pc';

async function main() {
  let operator = await R6.operator('pc', name, 'ace');
  console.log("operator", operator);
}
main();
/*
OUTPUT:
operator Stats {
  url: 'https://r6.tracker.network/profile/pc/waifu_-./operators',
  name: 'waifu_-.',
  header: 'https://ubisoft-avatars.akamaized.net/c5724a1b-374a-4a7e-898d-9f271ceb152f/default_256_256.png',
  operator: 'ACE',
  time_played: '100h 29m',
  kills: '2,216',
  deaths: '1,302',
  kd: '1.70',
  wins: '964',
  losses: '948',
  win_: '50%',
  headshots_: '43%',
  dbnos: '737',
  xp: '4,907,678',
  melee_kills: '13',
  operator_stat: '3,635  ',
  operator_img: 'https://trackercdn.com/cdn/r6.tracker.network/operators/badges/ace.png'
}
*/
```

  
## Example of made with Discord Bot  
* [**R6Bot**](https://github.com/hmes98318/R6Bot)
