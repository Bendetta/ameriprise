
var ArrayUtil = {};


ArrayUtil.random = function (array) {
    return array[Math.floor(array.length * Math.random())];
};


module.exports = ArrayUtil;
