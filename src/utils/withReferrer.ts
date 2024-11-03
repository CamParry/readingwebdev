export const withReferrer = (url: string) => {
    const _url = new URL(url);
    _url.searchParams.set("ref", import.meta.env.SITE_REF);
    return _url;
};
