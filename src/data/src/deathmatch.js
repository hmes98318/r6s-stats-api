module.exports = class Stats {
    constructor(url, name, header, kd, kills, deaths, win_, wins, losses, abandons, matches, kills_match, mmr, rank, rank_img) {

        this.url = url;
        this.name = name;
        this.header = header;

        this.kd = kd,
        this.kills = kills,
        this.deaths = deaths,
        this.win_ = win_,
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