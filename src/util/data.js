/** 次数处理，当次数大于10w级时已w为单位，当播放次数小于10w，正常显示次数
 * @param {string} count
 * */
exports.countHandle = (count) => {
    let wCount = parseInt(count / 100000);
    if (wCount > 0) {
        return wCount + '万';
    } else {
        return count;
    }
};

/**
 * @param code
 * @returns {string}
 */
exports.compile = (code) => {
    const codeStr = `${code}`;
    let c = String.fromCharCode(codeStr.charCodeAt(0) + codeStr.length);
    for (let i = 1; i < codeStr.length; i++) {
        c += String.fromCharCode(codeStr.charCodeAt(i) + codeStr.charCodeAt(i - 1));
    }
    c = escape(c.split('').join(' '));
    return c;
};

/**
 * @param code
 * @returns {string}
 */
exports.unCompile = (code) => {
    let codeStr = `${code}`;
    codeStr = unescape(codeStr).split(' ').join('');
    let c = String.fromCharCode(codeStr.charCodeAt(0) - codeStr.length);
    for (let i = 1; i < codeStr.length; i++) {
        c += String.fromCharCode(codeStr.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
};
