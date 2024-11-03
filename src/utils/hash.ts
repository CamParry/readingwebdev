import bcrypt from "bcrypt";

export const Hash = {
    generate: async (string: string) => {
        return await bcrypt.hash(string, 10);
    },
    verify: async (string: string, hash: string) => {
        return await bcrypt.compare(string, hash);
    },
};
