# r6s-stats-api

<a href="https://github.com/hmes98318/r6s-stats-api/actions"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/hmes98318/r6s-stats-api/Node.js%20Package?style=for-the-badge"></a>
<a href="https://www.npmjs.com/package/r6s-stats-api"><img alt="npm" src="https://img.shields.io/npm/v/r6s-stats-api?logo=npm&style=for-the-badge"></a>
<img alt="made-with-bash" src="https://img.shields.io/badge/-Made%20with%20Bash-1f425f.svg?style=for-the-badge&logo=image%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw%2FeHBhY2tldCBiZWdpbj0i77u%2FIiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8%2BIDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE3MDg2QTAyQUZCMzExRTVBMkQxRDMzMkJDMUQ4RDk3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE3MDg2QTAzQUZCMzExRTVBMkQxRDMzMkJDMUQ4RDk3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTcwODZBMDBBRkIzMTFFNUEyRDFEMzMyQkMxRDhEOTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTcwODZBMDFBRkIzMTFFNUEyRDFEMzMyQkMxRDhEOTciLz4gPC9yZGY6RGVzY3JpcHRpb24%2BIDwvcmRmOlJERj4gPC94OnhtcG1ldGE%2BIDw%2FeHBhY2tldCBlbmQ9InIiPz6lm45hAAADkklEQVR42qyVa0yTVxzGn7d9Wy03MS2ii8s%2BeokYNQSVhCzOjXZOFNF4jx%2BMRmPUMEUEqVG36jo2thizLSQSMd4N8ZoQ8RKjJtooaCpK6ZoCtRXKpRempbTv5ey83bhkAUphz8fznvP8znn%2B%2F3NeEEJgNBoRRSmz0ub%2FfuxEacBg%2FDmYtiCjgo5NG2mBXq%2BH5I1ogMRk9Zbd%2BQU2e1ML6VPLOyf5tvBQ8yT1lG10imxsABm7SLs898GTpyYynEzP60hO3trHDKvMigUwdeaceacqzp7nOI4n0SSIIjl36ao4Z356OV07fSQAk6xJ3XGg%2BLCr1d1OYlVHp4eUHPnerU79ZA%2F1kuv1JQMAg%2BE4O2P23EumF3VkvHprsZKMzKwbRUXFEyTvSIEmTVbrysp%2BWr8wfQHGK6WChVa3bKUmdWou%2BjpArdGkzZ41c1zG%2Fu5uGH4swzd561F%2BuhIT4%2BLnSuPsv9%2BJKIpjNr9dXYOyk7%2FBZrcjIT4eCnoKgedJP4BEqhG77E3NKP31FO7cfQA5K0dSYuLgz2TwCWJSOBzG6crzKK%2BohNfni%2Bx6OMUMMNe%2Fgf7ocbw0v0acKg6J8Ql0q%2BT%2FAXR5PNi5dz9c71upuQqCKFAD%2BYhrZLEAmpodaHO3Qy6TI3NhBpbrshGtOWKOSMYwYGQM8nJzoFJNxP2HjyIQho4PewK6hBktoDcUwtIln4PjOWzflQ%2Be5yl0yCCYgYikTclGlxadio%2BBQCSiW1UXoVGrKYwH4RgMrjU1HAB4vR6LzWYfFUCKxfS8Ftk5qxHoCUQAUkRJaSEokkV6Y%2F%2BJUOC4hn6A39NVXVBYeNP8piH6HeA4fPbpdBQV5KOx0QaL1YppX3Jgk0TwH2Vg6S3u%2BdB91%2B%2FpuNYPYFl5uP5V7ZqvsrX7jxqMXR6ff3gCQSTzFI0a1TX3wIs8ul%2Bq4HuWAAiM39vhOuR1O1fQ2gT%2F26Z8Z5vrl2OHi9OXZn995nLV9aFfS6UC9JeJPfuK0NBohWpCHMSAAsFe74WWP%2BvT25wtP9Bpob6uGqqyDnOtaeumjRu%2ByFu36VntK%2FPA5umTJeUtPWZSU9BCgud661odVp3DZtkc7AnYR33RRC708PrVi1larW7XwZIjLnd7R6SgSqWSNjU1B3F72pz5TZbXmX5vV81Yb7Lg7XT%2FUXriu8XLVqw6c6XqWnBKiiYU%2BMt3wWF7u7i91XlSEITwSAZ%2FCzAAHsJVbwXYFFEAAAAASUVORK5CYII%3D"></a>
<a href="https://github.com/hmes98318/r6s-stats-api/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/hmes98318/r6s-stats-api?style=for-the-badge&color=brightgreen"></a>

### An api for fetching player statistics from Rainbow Six Siege

### Notice  
**This api depend on the `bash`**  
**normal work on `Linux` `Max OS`**  
**`Windows` need to install [`WSL`](https://docs.microsoft.com/en-us/windows/wsl/install) or [`git bash`](https://git-scm.com/download/win)**  
**There may be problems with using the `PowerShell`**  

## Installation  
```
$ npm i r6s-stats-api
```


## Example Usage  
You can get the statistics struct of a player by using the code below.  
```js
const R6 = require('r6s-stats-api');

let platform = "pc";
let name = "waifu_-.";

async function main() {
  let general = await R6.general(platform, name);
  console.log("general", general);
}
main();
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
 

[**deathmatch()**](https://github.com/hmes98318/r6s-stats-api#deathmatchplatform-string-namestring)  
> `url`,`name`,`header`,  
> `kd`,`kills`,`deaths`,`win_`,`wins`,`losses`,`abadons`,  
> `matches`,`kills_match`,`mmr`,`rank`,`rank_img`  


[**operator()**](https://github.com/hmes98318/r6s-stats-api#operatorplatform-string-namestring-operatorstring)  
> `url`,`name`,`header`,  
> `kd`,`kills`,`deaths`,`win_`,`wins`,`losses`,`headshots_`,  
> `time_played`,`operator`,`operator_img`,`melee_kills`,`operator_stat`,`dbnos`,`xp`  



## Available Functions  

### general(platform `string`, name`string`)
```js
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

### deathmatch(platform `string`, name`string`)
```js
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
* [**hmes98318/R6Bot**](https://github.com/hmes98318/R6Bot)  
* [**KieranRobson/Clarence-Bot**](https://github.com/KieranRobson/Clarence-Bot)
