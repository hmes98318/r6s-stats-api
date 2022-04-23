const options = ["pc", "uplay", "ps", "xbox"];

module.exports = function (platform) {
    if (!platform)
        return false;

    if ((platform === "pc" || platform === "uplay") ||
        (platform[0] === 'p' && platform[1] === 's') ||
        (platform[0] === 'x' && platform[1] === 'b' && platform[2] === 'o' && platform[3] === 'x'))
        return true;
    else
        return false;
}