const Stats = require('./src/data/stats.js');
const rankImg = require('./src/modules/rankimg.js');


let general_stats = new Stats.general();
let casual_stats = new Stats.casual();
let rank_stats = new Stats.rank();
let unrank_stats = new Stats.unrank();
let deathmatch_stats = new Stats.deathmatch();
let operator_stats = new Stats.operator();




module.exports = {
  /**
  * Fetch General stats.
  * If not found stats or get any error will return "NOT_FOUND".
  * @param platform Platform for player
  * @param name Player name
  */
  general: async function (platform, name) {
    const tracker = require('./src/general.js');
    let url = `https://r6.tracker.network/profile/${platform}/${name}/`;
    let track = await tracker(url);

    if (track[0] === "error")
      return "NOT_FOUND";

    let header = track[0];
    let level = track[1];
    let profile = track[2];

    //console.log(track);


    general_stats.url = url;
    general_stats.name = name;
    general_stats.header = header;

    general_stats.level = level[level.indexOf('Level') + 1];

    general_stats.kd = profile[profile.indexOf('KD') + 1];
    general_stats.deaths = profile[profile.indexOf('Deaths') + 1];
    general_stats.headshot_ = profile[profile.indexOf('Headshot %') + 1];
    general_stats.headshots = profile[profile.indexOf('Headshots') + 1];
    general_stats.win_ = profile[profile.indexOf('Win %') + 1];
    general_stats.wins = profile[profile.indexOf('Wins') + 1];
    general_stats.losses = profile[profile.indexOf('Losses') + 1];

    general_stats.time_played = profile[profile.indexOf('Time Played') + 1];
    general_stats.matches_played = profile[profile.indexOf('Matches Played') + 1];
    general_stats.total_xp = profile[profile.indexOf('Total XP') + 1];
    general_stats.melee_kills = profile[profile.indexOf('Melee Kills') + 1];
    general_stats.blind_kills = profile[profile.indexOf('Blind Kills') + 1];

    return general_stats;
  },

  /**
  * Fetch Casual stats.
  * If not found stats or get any error will return "NOT_FOUND".
  * @param platform Platform for player
  * @param name Player name
  */
  casual: async function (platform, name) {
    const tracker = require('./src/casual.js');
    let url = `https://r6.tracker.network/profile/${platform}/${name}/`;
    let track = await tracker(url);

    if (track[0] === "error")
      return "NOT_FOUND";

    let header = track[0];
    let rank = track[1];
    let profile = track[2];

    //console.log(track);


    casual_stats.url = url;
    casual_stats.name = name;
    casual_stats.header = header;

    casual_stats.kd = profile[profile.indexOf('KD') + 1];
    casual_stats.kills = profile[profile.indexOf('Kills') + 1];
    casual_stats.deaths = profile[profile.indexOf('Deaths') + 1];
    casual_stats.win_ = profile[profile.indexOf('Win %') + 1];
    casual_stats.wins = profile[profile.indexOf('Wins') + 1];
    casual_stats.losses = profile[profile.indexOf('Losses') + 1];

    casual_stats.time_played = profile[profile.indexOf('Time Played') + 1];
    casual_stats.matches = profile[profile.indexOf('Matches') + 1];
    casual_stats.Kills_match = profile[profile.indexOf('Kills/match') + 1];
    casual_stats.Kills_min = profile[profile.indexOf('Kills/min') + 1];

    casual_stats.mmr = rank[rank.indexOf('MMR') + 1];
    casual_stats.rank = rank[rank.indexOf('Rank') + 1];
    casual_stats.rank_img = rankImg(casual_stats.rank);

    return casual_stats;
  },

  /**
  * Fetch Rank stats.
  * If not found stats or get any error will return "NOT_FOUND".
  * @param platform Platform for player
  * @param name Player name
  */
  rank: async function (platform, name) {
    const tracker = require('./src/rank.js');
    let url = `https://r6.tracker.network/profile/${platform}/${name}/`;
    let track = await tracker(url);

    if (track[0] === "error")
      return "NOT_FOUND";

    let header = track[0];
    let rank = track[1];
    let profile = track[2];

    //console.log(track);


    rank_stats.url = url;
    rank_stats.name = name;
    rank_stats.header = header;

    rank_stats.kd = profile[profile.indexOf('KD') + 1];
    rank_stats.kills = profile[profile.indexOf('Kills') + 1];
    rank_stats.deaths = profile[profile.indexOf('Deaths') + 1];
    rank_stats.win_ = profile[profile.indexOf('Win %') + 1];
    rank_stats.wins = profile[profile.indexOf('Wins') + 1];
    rank_stats.losses = profile[profile.indexOf('Losses') + 1];

    rank_stats.time_played = profile[profile.indexOf('Time Played') + 1];
    rank_stats.matches = profile[profile.indexOf('Matches') + 1];
    rank_stats.Kills_match = profile[profile.indexOf('Kills/match') + 1];
    rank_stats.Kills_min = profile[profile.indexOf('Kills/min') + 1];

    rank_stats.mmr = rank[rank.indexOf('MMR') + 1];
    rank_stats.rank = rank[rank.indexOf('Rank') + 1];
    rank_stats.rank_img = rankImg(rank_stats.rank);

    return rank_stats;
  },

  /**
  * Fetch Unrank stats.
  * If not found stats or get any error will return "NOT_FOUND".
  * @param platform Platform for player
  * @param name Player name
  */
  unrank: async function (platform, name) {
    const tracker = require('./src/unrank.js');
    let url = `https://r6.tracker.network/profile/${platform}/${name}/`;
    let track = await tracker(url);

    if (track[0] === "error")
      return "NOT_FOUND";

    let header = track[0];
    let profile = track[1];

    //console.log(track);


    unrank_stats.url = url;
    unrank_stats.name = name;
    unrank_stats.header = header;

    unrank_stats.kd = profile[profile.indexOf('KD') + 1];
    unrank_stats.kills = profile[profile.indexOf('Kills') + 1];
    unrank_stats.deaths = profile[profile.indexOf('Deaths') + 1];
    unrank_stats.win_ = profile[profile.indexOf('Win %') + 1];
    unrank_stats.wins = profile[profile.indexOf('Wins') + 1];
    unrank_stats.losses = profile[profile.indexOf('Losses') + 1];

    unrank_stats.time_played = profile[profile.indexOf('Time Played') + 1];
    unrank_stats.matches = profile[profile.indexOf('Matches') + 1];
    unrank_stats.Kills_match = profile[profile.indexOf('Kills/match') + 1];
    unrank_stats.Kills_min = profile[profile.indexOf('Kills/min') + 1];

    return unrank_stats;
  },

  /**
  * Fetch Deathmatch stats.
  * If not found stats or get any error will return "NOT_FOUND".
  * @param platform Platform for player
  * @param name Player name
  */
  deathmatch: async function (platform, name) {
    const tracker = require('./src/deathmatch.js');
    let url = `https://r6.tracker.network/profile/${platform}/${name}/`;
    let track = await tracker(url);

    if (track[0] === "error")
      return "NOT_FOUND";

      let header = track[0];
    let rank = track[1];
    let profile = track[1];

    //console.log(track);


    deathmatch_stats.url = url;
    deathmatch_stats.name = name;
    deathmatch_stats.header = header;

    deathmatch_stats.kd = profile[profile.indexOf('K/D') + 1];
    deathmatch_stats.kills = profile[profile.indexOf('Kills') + 1];
    deathmatch_stats.deaths = profile[profile.indexOf('Deaths') + 1];
    deathmatch_stats.win_ = profile[profile.indexOf('Win %') + 1];
    deathmatch_stats.wins = profile[profile.indexOf('Wins') + 1];
    deathmatch_stats.losses = profile[profile.indexOf('Losses') + 1];

    deathmatch_stats.abandons = profile[profile.indexOf('Abandons') + 1];
    deathmatch_stats.matches = String(parseInt(deathmatch_stats.wins) + parseInt(deathmatch_stats.losses) + parseInt(deathmatch_stats.abandons));
    deathmatch_stats.Kills_match = profile[profile.indexOf('Kills/Match') + 1];


    deathmatch_stats.mmr = rank[rank.indexOf('MMR') + 1];
    deathmatch_stats.rank = rank[rank.indexOf('Rank') + 1];
    deathmatch_stats.rank_img = rankImg(deathmatch_stats.rank);

    return deathmatch_stats;
  },

  /**
  * Fetch Operators stats.
  * If not found stats or get any error will return "NOT_FOUND".
  * @param platform Platform for player
  * @param name Player name
  * @param operator operator name
  */
  operator: async function (platform, name, operator) {
    const tracker = require('./src/operator.js');
    let url = `https://r6.tracker.network/profile/${platform}/${name}/operators`;
    let track = await tracker(url, operator.toUpperCase());

    if (track[0] === "error")
      return "NOT_FOUND";

    let header = track[0];
    let operator_img = track[1];
    let board = track[2];
    let profile = track[3];

    //console.log(track);


    operator_stats.url = url;
    operator_stats.name = name;
    operator_stats.header = header;

    operator_stats.operator = profile[board.indexOf("Operator ")];
    operator_stats.time_played = profile[board.indexOf("Time Played")];
    operator_stats.kills = profile[board.indexOf("Kills")];
    operator_stats.deaths = profile[board.indexOf("Deaths")];
    operator_stats.kd = profile[board.indexOf("K/D")];
    operator_stats.wins = profile[board.indexOf("Wins")];
    operator_stats.losses = profile[board.indexOf("Losses")];
    operator_stats.win_ = profile[board.indexOf("Win %")];
    operator_stats.headshots_ = profile[board.indexOf("Headshot %")];

    operator_stats.dbnos = profile[board.indexOf("DBNOs")];
    operator_stats.xp = profile[board.indexOf("XP")];
    operator_stats.melee_kills = profile[board.indexOf("Melee Kills")];
    operator_stats.operator_stat = profile[board.indexOf("Operator Stat")];
    operator_stats.operator_img = operator_img;

    return operator_stats;
  }
}