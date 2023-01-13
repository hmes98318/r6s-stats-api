module.exports = function (parameter) {
    const num = parameter.replaceAll(',', '').replaceAll('%','');
    let res = Number(num);
    if (isNaN(res))
        res = 0;
    return res;
}