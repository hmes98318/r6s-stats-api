module.exports = class Stats {
    constructor(url, name, kd, kills, deaths, win_, wins, losses, abandons, matches, Kills_match, mmr, rank, rank_img) {

        this.url = url;
        this.name = name;

        this.kd = kd,
        this.kills = kills,
        this.deaths = deaths,
        this.win_ = win_,
        this.wins = wins,
        this.losses = losses,

        this.abandons = abandons,
        this.matches = matches,
        this.Kills_match = Kills_match,

        this.mmr = mmr,
        this.rank = rank,
        this.rank_img = rank_img
    }
}