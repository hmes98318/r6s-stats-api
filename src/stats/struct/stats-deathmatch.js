module.exports = class Stats {
    constructor(url, name, header, kd, kills, deaths, win_percent, wins, losses, abandons, matches, kills_match, mmr, rank, rank_img) {

        this.url = url;
        this.username = name;
        this.avatar= header;

        this.kd = kd,
        this.kills = kills,
        this.deaths = deaths,
        this.win_percent = win_percent,
        this.wins = wins,
        this.losses = losses,

        this.abandons = abandons,
        this.matches = matches,
        this.kills_match = kills_match,

        this.mmr = mmr,
        this.rank = rank,
        this.rank_img = rank_img
    }
}