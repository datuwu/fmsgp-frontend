export const swapObjectField = <T, K extends keyof T>(obj: T, key1: K, key2: K) => {
    const temp = obj[key1];
    obj[key1] = obj[key2];
    obj[key2] = temp;
    return obj;
};

export const swapArrayObjectField = <T, K extends keyof T>(arr: T[], key1: K, key2: K) => {
    return arr.map((item) => swapObjectField(item, key1, key2));
};

export const overwriteObjectField = <T, K extends keyof T>(obj: T, overwriteKey: K, key: K) => {
    obj[overwriteKey] = obj[key];
    return obj;
};

export const overwriteArrayObjectField = <T, K extends keyof T>(arr: T[], overwriteKey: K, key: K) => {
    return arr.map((item) => overwriteObjectField(item, overwriteKey, key));
};
