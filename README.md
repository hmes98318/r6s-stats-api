# r6s-stats-api

<a href="https://github.com/hmes98318/r6s-stats-api/actions"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/hmes98318/r6s-stats-api/npm-publish.yml?branch=main&style=for-the-badge"></a>
<a href="https://www.npmjs.com/package/r6s-stats-api"><img alt="npm" src="https://img.shields.io/npm/v/r6s-stats-api?logo=npm&style=for-the-badge"></a>
<a href="https://github.com/hmes98318/r6s-stats-api/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/hmes98318/r6s-stats-api?style=for-the-badge&color=brightgreen"></a>

### An api for fetching player statistics from Rainbow Six Siege


## Installation

```
$ npm i r6s-stats-api
```

## Example Usage

You can get the statistics struct of a player by using the code below.

```js
const R6 = require('r6s-stats-api');

let platform = 'pc';
let name = 'waifu_-.';

async function main() {
    let general = await R6.general(platform, name);
    console.log('general', general);
}
main();
```


## Valid Parameters

[**general()**](#generalplatform-string-name-string)
> `url`, `name`, `header`, `level`,  
> `kd`, `kills`, `deaths`, `win_`, `wins`, `losses`, `headshot_`, `headshots`,   
> `time_played`, `matches_played`, `total_xp`, `melee_kills`, `blind_kills`

[**casual()**](#casualplatform-string-name-string)
> `url`, `name`, `header`,   
> `kd`, `kills`, `deaths`, `win_`, `wins`, `losses`,   
> `time_played`, `matches`, `kills_match`, `kills_min`, `mmr`, `rank`, `rank_img`

[**rank()**](#rankplatform-string-name-string)
> `url`, `name`, `header`,   
> `kd`, `kills`, `deaths`, `win_`, `wins`, `losses`,   
> `time_played`, `matches`, `kills_match`, `kills_min`, `mmr`, `rank`, `rank_img`

[**deathmatch()**](#deathmatchplatform-string-name-string)
> `url`, `name`, `header`,   
> `kd`, `kills`, `deaths`, `win_`, `wins`, `losses`, `abadons`,   
> `matches`, `kills_match`, `mmr`, `rank`, `rank_img`

[**operator()**](#operatorplatform-string-name-string-operator-string)
> `url`, `name`, `header`,   
> `kd`, `kills`, `deaths`, `win_`, `wins`, `losses`, `headshots_`,   
> `time_played`, `operator`, `operator_img`, `melee_kills`, `operator_stat`, `dbnos`, `xp`


## Available Functions

### general(platform `string`, name `string`);

```js
async function main() {
    let general = await R6.general(platform, name);
    console.log('general', general);
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

### casual(platform `string`, name `string`);

```js
async function main() {
    let casual = await R6.casual(platform, name);
    console.log('casual', casual);
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

### rank(platform `string`, name `string`);

```js
async function main() {
    let rank = await R6.rank(platform, name);
    console.log('rank', rank);
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

### deathmatch(platform `string`, name `string`);

```js
async function main() {
    let deathmatch = await R6.deathmatch(platform, name);
    console.log('deathmatch', deathmatch);
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

### operator(platform `string`, name `string`, operator `string`);

```js
async function main() {
    let operator = await R6.operator(platform, name, 'ace');
    console.log('operator', operator);
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

- [**hmes98318/R6Bot**](https://github.com/hmes98318/R6Bot)  
- [**KieranRobson/Clarence-Bot**](https://github.com/KieranRobson/Clarence-Bot)  
