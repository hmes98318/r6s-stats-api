module.exports = class Stats {
    constructor(url, name, header, kd, kills, deaths, win_, wins, losses, time_played, matches, kills_match, kills_min) {

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
        this.kills_match = kills_match,
        this.kills_min = kills_min
    }
}