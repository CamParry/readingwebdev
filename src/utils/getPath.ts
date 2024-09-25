export function getPath(url: URL) {
    return url.pathname.split("/")[1];
}
