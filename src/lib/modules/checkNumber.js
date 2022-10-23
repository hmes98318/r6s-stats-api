module.exports = function (parameter) {
    const regex = new RegExp(/\d/);
    return regex.test(parameter) ? parameter : 0;
}