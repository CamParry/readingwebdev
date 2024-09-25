export function calculateYearsSince(date: Date) {
    const ageDiffMs = Date.now() - date.valueOf();
    const ageDate = new Date(ageDiffMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
