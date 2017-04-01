export const joinPaths = (...paths: string[]) => {
    let trailingSlash = paths[paths.length - 1].endsWith('/');
    let joinedPath = paths.map(path => path.replace(/(^\/|\/$)/g, '')).join('/');
    return trailingSlash ? joinedPath + '/' : joinedPath;
};

export const isURL = (s: string) => /^(http|https|ftp):\/\//.test(s);

export const queryString = (data: any) => {
    return Object.keys(data).map((key) => [key, data[key]].map(encodeURIComponent).join('=')).join('&');
};
