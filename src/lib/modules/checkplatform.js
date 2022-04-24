const options = ["pc", "psn", "xbox"];

module.exports = function (platform) {
    if (!platform)
        return false;

    for (let element of options) {
        if (platform === element)
            return true;
    }
    return false;
}