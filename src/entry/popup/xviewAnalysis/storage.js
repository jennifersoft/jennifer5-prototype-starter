export const getItem = (key, def = '', type = String) => {
    const value = localStorage.getItem(key);
    if (value == null) return def;

    if (type == Boolean) return value === 'true';
    else if (type == Array) return value.split(',');

    return type(value);
};

export const setItem = (key, value = '') => {
    if (typeof value == 'object' && value.length > 0) {
        localStorage.setItem(key, value.join(','));
    } else {
        localStorage.setItem(key, value);
    }
};

export const removeItem = key => {
    localStorage.removeItem(key);
};
