export const isActivePath = (active: string, path: string) => {
    return new RegExp(`^${path}.*$`).test(active);
};
