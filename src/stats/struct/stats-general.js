module.exports = class Stats {
    constructor(url, name, header, level, kd, kills, deaths, win_percent, wins, losses, headshot_percent, headshots, time_played, matches_played, total_xp, melee_kills, blind_kills) {

        this.url = url;
        this.username = name;
        this.avatar= header;

        this.level = level;

        this.kd = kd,
        this.kills = kills,
        this.deaths = deaths,
        this.win_percent = win_percent,
        this.wins = wins,
        this.losses = losses,

        this.headshot_percent = headshot_percent,
        this.headshots = headshots,

        this.time_played = time_played,
        this.matches_played = matches_played,
        this.total_xp = total_xp,
        this.melee_kills = melee_kills,
        this.blind_kills = blind_kills
    }
}