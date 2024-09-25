export const getSearchParam = <
    const Options extends string[],
    Default extends Options[number],
>(
    url: URL,
    name: string,
    validOptions: Options,
    defaultValue?: Default
) => {
    const value = url.searchParams.get(name);
    if (value && validOptions.includes(value)) {
        return value as Options[number];
    }
    return defaultValue ?? undefined;
};
