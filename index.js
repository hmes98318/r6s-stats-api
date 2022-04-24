const Stats = require('./src/data/stats.js');
const Fetch = require('./src/fetch.js');
const rankImg = require('./src/lib/modules/rankimg.js');
const chechPlatform = require('./src/lib/modules/checkplatform.js');


let stats_general = new Stats.dataGeneral();
let stats_casual = new Stats.dataCasual();
let stats_rank = new Stats.dataRank();
let stats_unrank = new Stats.dataUnrank();
let stats_deathmatch = new Stats.dataDeathmatch();
let stats_operator = new Stats.dataOperator();




module.exports = {
  general: async function (platform, name) {
    if (typeof (platform) !== "string" || typeof (name) !== "string") return "FORMAT_ERROR";
    if (!chechPlatform(platform.toLowerCase())) return "PLATFORM_ERROR";

    let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
    let track = await Fetch.trackGeneral(url);

    if (track[0] === "error")
      return "NOT_FOUND";

    if (track[0] === "timeout")
      return "TIME_OUT";

    let header = track[0];
    let level = track[1];
    let profile = track[2];

    //console.log(track);


    stats_general.url = url;
    stats_general.name = name;
    stats_general.header = header;

    stats_general.level = level[level.indexOf('Level') + 1];

    stats_general.kd = profile[profile.indexOf('KD') + 1];
    stats_general.kills = level[level.indexOf('Kills') + 1];
    stats_general.deaths = profile[profile.indexOf('Deaths') + 1];
    stats_general.win_ = profile[profile.indexOf('Win %') + 1];
    stats_general.wins = profile[profile.indexOf('Wins') + 1];
    stats_general.losses = profile[profile.indexOf('Losses') + 1];

    stats_general.headshot_ = profile[profile.indexOf('Headshot %') + 1];
    stats_general.headshots = profile[profile.indexOf('Headshots') + 1];

    stats_general.time_played = profile[profile.indexOf('Time Played') + 1];
    stats_general.matches_played = profile[profile.indexOf('Matches Played') + 1];
    stats_general.total_xp = profile[profile.indexOf('Total XP') + 1];
    stats_general.melee_kills = profile[profile.indexOf('Melee Kills') + 1];
    stats_general.blind_kills = profile[profile.indexOf('Blind Kills') + 1];

    return stats_general;
  },

  casual: async function (platform, name) {
    if (typeof (platform) !== "string" || typeof (name) !== "string") return "FORMAT_ERROR";
    if (!chechPlatform(platform.toLowerCase())) return "PLATFORM_ERROR";

    let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
    let track = await Fetch.trackCasual(url);

    if (track[0] === "error")
      return "NOT_FOUND";

    if (track[0] === "timeout")
      return "TIME_OUT";

    let header = track[0];
    let rank = track[1];
    let profile = track[2];

    //console.log(track);


    stats_casual.url = url;
    stats_casual.name = name;
    stats_casual.header = header;

    stats_casual.kd = profile[profile.indexOf('KD') + 1];
    stats_casual.kills = profile[profile.indexOf('Kills') + 1];
    stats_casual.deaths = profile[profile.indexOf('Deaths') + 1];
    stats_casual.win_ = profile[profile.indexOf('Win %') + 1];
    stats_casual.wins = profile[profile.indexOf('Wins') + 1];
    stats_casual.losses = profile[profile.indexOf('Losses') + 1];

    stats_casual.time_played = profile[profile.indexOf('Time Played') + 1];
    stats_casual.matches = profile[profile.indexOf('Matches') + 1];
    stats_casual.kills_match = profile[profile.indexOf('Kills/match') + 1];
    stats_casual.kills_min = profile[profile.indexOf('Kills/min') + 1];

    stats_casual.mmr = rank[rank.indexOf('MMR') + 1];
    stats_casual.rank = rank[rank.indexOf('Rank') + 1];
    stats_casual.rank_img = rankImg(stats_casual.rank);

    return stats_casual;
  },

  rank: async function (platform, name) {
    if (typeof (platform) !== "string" || typeof (name) !== "string") return "FORMAT_ERROR";
    if (!chechPlatform(platform.toLowerCase())) return "PLATFORM_ERROR";

    let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
    let track = await Fetch.trackRank(url);

    if (track[0] === "error")
      return "NOT_FOUND";

    if (track[0] === "timeout")
      return "TIME_OUT";

    let header = track[0];
    let rank = track[1];
    let profile = track[2];

    //console.log(track);


    stats_rank.url = url;
    stats_rank.name = name;
    stats_rank.header = header;

    stats_rank.kd = profile[profile.indexOf('KD') + 1];
    stats_rank.kills = profile[profile.indexOf('Kills') + 1];
    stats_rank.deaths = profile[profile.indexOf('Deaths') + 1];
    stats_rank.win_ = profile[profile.indexOf('Win %') + 1];
    stats_rank.wins = profile[profile.indexOf('Wins') + 1];
    stats_rank.losses = profile[profile.indexOf('Losses') + 1];

    stats_rank.time_played = profile[profile.indexOf('Time Played') + 1];
    stats_rank.matches = profile[profile.indexOf('Matches') + 1];
    stats_rank.kills_match = profile[profile.indexOf('Kills/match') + 1];
    stats_rank.kills_min = profile[profile.indexOf('Kills/min') + 1];

    stats_rank.mmr = rank[rank.indexOf('MMR') + 1];
    stats_rank.rank = rank[rank.indexOf('Rank') + 1];
    stats_rank.rank_img = rankImg(stats_rank.rank);

    return stats_rank;
  },

  unrank: async function (platform, name) {
    if (typeof (platform) !== "string" || typeof (name) !== "string") return "FORMAT_ERROR";
    if (!chechPlatform(platform.toLowerCase())) return "PLATFORM_ERROR";

    let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
    let track = await Fetch.trackUnrank(url);

    if (track[0] === "error")
      return "NOT_FOUND";

    if (track[0] === "timeout")
      return "TIME_OUT";

    let header = track[0];
    let profile = track[1];

    //console.log(track);


    stats_unrank.url = url;
    stats_unrank.name = name;
    stats_unrank.header = header;

    stats_unrank.kd = profile[profile.indexOf('KD') + 1];
    stats_unrank.kills = profile[profile.indexOf('Kills') + 1];
    stats_unrank.deaths = profile[profile.indexOf('Deaths') + 1];
    stats_unrank.win_ = profile[profile.indexOf('Win %') + 1];
    stats_unrank.wins = profile[profile.indexOf('Wins') + 1];
    stats_unrank.losses = profile[profile.indexOf('Losses') + 1];

    stats_unrank.time_played = profile[profile.indexOf('Time Played') + 1];
    stats_unrank.matches = profile[profile.indexOf('Matches') + 1];
    stats_unrank.kills_match = profile[profile.indexOf('Kills/match') + 1];
    stats_unrank.kills_min = profile[profile.indexOf('Kills/min') + 1];

    return stats_unrank;
  },

  deathmatch: async function (platform, name) {
    if (typeof (platform) !== "string" || typeof (name) !== "string") return "FORMAT_ERROR";
    if (!chechPlatform(platform.toLowerCase())) return "PLATFORM_ERROR";

    let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/`;
    let track = await Fetch.trackDeathmatch(url);

    if (track[0] === "error")
      return "NOT_FOUND";

    if (track[0] === "timeout")
      return "TIME_OUT";

    let header = track[0];
    let rank = track[1];
    let profile = track[1];

    //console.log(track);


    stats_deathmatch.url = url;
    stats_deathmatch.name = name;
    stats_deathmatch.header = header;

    stats_deathmatch.kd = profile[profile.indexOf('K/D') + 1];
    stats_deathmatch.kills = profile[profile.indexOf('Kills') + 1];
    stats_deathmatch.deaths = profile[profile.indexOf('Deaths') + 1];
    stats_deathmatch.win_ = profile[profile.indexOf('Win %') + 1];
    stats_deathmatch.wins = profile[profile.indexOf('Wins') + 1];
    stats_deathmatch.losses = profile[profile.indexOf('Losses') + 1];

    stats_deathmatch.abandons = profile[profile.indexOf('Abandons') + 1];
    stats_deathmatch.matches = String(parseInt(stats_deathmatch.wins) + parseInt(stats_deathmatch.losses) + parseInt(stats_deathmatch.abandons));
    stats_deathmatch.kills_match = profile[profile.indexOf('Kills/Match') + 1];


    stats_deathmatch.mmr = rank[rank.indexOf('MMR') + 1];
    stats_deathmatch.rank = rank[rank.indexOf('Rank') + 1];
    stats_deathmatch.rank_img = rankImg(stats_deathmatch.rank);

    return stats_deathmatch;
  },

  operator: async function (platform, name, operator) {
    if (typeof (platform) !== "string" || typeof (name) !== "string") return "FORMAT_ERROR";
    if (!chechPlatform(platform.toLowerCase())) return "PLATFORM_ERROR";

    let url = `https://r6.tracker.network/profile/${platform.toLowerCase()}/${name}/operators`;
    let track = await Fetch.trackOperator(url, operator.toUpperCase());

    if (track[0] === "error")
      return "NOT_FOUND";

    if (track[0] === "timeout")
      return "TIME_OUT";

    let header = track[0];
    let operator_img = track[1];
    let board = track[2];
    let profile = track[3];

    //console.log(track);


    stats_operator.url = url;
    stats_operator.name = name;
    stats_operator.header = header;

    stats_operator.operator = profile[board.indexOf("Operator ")];

    stats_operator.kd = profile[board.indexOf("K/D")];
    stats_operator.kills = profile[board.indexOf("Kills")];
    stats_operator.deaths = profile[board.indexOf("Deaths")];
    stats_operator.win_ = profile[board.indexOf("Win %")];
    stats_operator.wins = profile[board.indexOf("Wins")];
    stats_operator.losses = profile[board.indexOf("Losses")];

    stats_operator.headshots_ = profile[board.indexOf("Headshot %")];

    stats_operator.time_played = profile[board.indexOf("Time Played")];
    stats_operator.dbnos = profile[board.indexOf("DBNOs")];
    stats_operator.xp = profile[board.indexOf("XP")];
    stats_operator.melee_kills = profile[board.indexOf("Melee Kills")];
    stats_operator.operator_stat = profile[board.indexOf("Operator Stat")];
    stats_operator.operator_img = operator_img;

    return stats_operator;
  }
}