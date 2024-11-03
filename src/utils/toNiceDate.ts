import { format } from "date-fns";

export const toNiceDate = (date: string) => {
    return format(new Date(date), "d MMM yyyy");
};
