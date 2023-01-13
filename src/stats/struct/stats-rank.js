module.exports = class Stats {
    constructor(url, name, header, kd, kills, deaths, win_percent, wins, losses, time_played, matches, kills_match, kills_min, mmr, rank, rank_img) {

        this.url = url;
        this.username = name;
        this.avatar= header;

        this.kd = kd,
        this.kills = kills,
        this.deaths = deaths,
        this.win_percent = win_percent,
        this.wins = wins,
        this.losses = losses,

        this.time_played = time_played,
        this.matches = matches,
        this.kills_match = kills_match,
        this.kills_min = kills_min,

        this.mmr = mmr,
        this.rank = rank,
        this.rank_img = rank_img
    }
}