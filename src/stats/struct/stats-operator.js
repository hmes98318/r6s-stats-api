module.exports = class Stats {
    constructor(url, name, header, operator, time_played, kills, deaths, kd, wins, losses, win_percent, headshots_, dbnos, xp, melee_kills, operator_stat, operator_img) {

        this.url = url;
        this.username = name;
        this.avatar= header;

        this.operator = operator,
        this.time_played = time_played,

        this.kills = kills,
        this.deaths = deaths,
        this.kd = kd,
        this.wins = wins,
        this.losses = losses,
        this.win_percent = win_percent,
        this.headshots_ = headshots_,

        this.dbnos = dbnos,
        this.xp = xp,
        this.melee_kills = melee_kills,
        this.operator_stat = operator_stat,
        this.operator_img = operator_img
    }
}