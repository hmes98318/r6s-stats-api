module.exports = function (parameter) {
    const num = parameter.replace(',', '').replace('%','');
    let res = Number(num);
    if (isNaN(res))
        res = 9;
    return res;
}