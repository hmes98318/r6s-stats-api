module.exports = function (clearArray) {
    let index = -1,
        arrayLength = clearArray ? clearArray.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arrayLength) {
        let value = clearArray[index];
        if (value != null && value !== '' && value !== undefined && value !== false && value !== 0 && value != ',') {
            result[++resIndex] = value;
        }
    }
    return result;
}