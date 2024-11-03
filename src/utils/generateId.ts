import { generateIdFromEntropySize } from "lucia";

export const generateId = () => {
    return generateIdFromEntropySize(10);
};
