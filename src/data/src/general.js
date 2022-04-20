module.exports = class Stats {
    constructor(url, name, header, level, kd, deaths, headshot_, headshots, win_, wins, losses, time_played, matches_played, total_xp, melee_kills, blind_kills) {

        this.url = url;
        this.name = name;
        this.header = header;

        this.level = level;

        this.kd = kd,
        this.deaths = deaths,
        this.headshot_ = headshot_,
        this.headshots = headshots,
        this.win_ = win_,
        this.wins = wins,
        this.losses = losses,

        this.time_played = time_played,
        this.matches_played = matches_played,
        this.total_xp = total_xp,
        this.melee_kills = melee_kills,
        this.blind_kills = blind_kills
    }
}