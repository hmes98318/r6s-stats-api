module.exports = class Stats {
    constructor(url, name, header, kd, kills, deaths, win_, wins, losses, time_played, matches, Kills_match, Kills_min, mmr, rank, rank_img) {

        this.url = url;
        this.name = name;
        this.header = header;

        this.kd = kd,
        this.kills = kills,
        this.deaths = deaths,
        this.win_ = win_,
        this.wins = wins,
        this.losses = losses,

        this.time_played = time_played,
        this.matches = matches,
        this.Kills_match = Kills_match,
        this.Kills_min = Kills_min,

        this.mmr = mmr,
        this.rank = rank,
        this.rank_img = rank_img
    }
}