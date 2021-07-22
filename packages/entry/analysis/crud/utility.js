export const printTableStr = (obj, isBlank) => {
    const result = [];

    for (let key in obj) {
        result.push(key + '(' + obj[key].join('') + ')');
    }

    return result.join(!isBlank ? ', ' : ' ');
};
