// export const aggregate = <
//     TRow extends Record<string, (Record<string, any> & { id: string }) | null>,
//     TRoot extends keyof TRow,
//     TAgg extends keyof TRow,
//     TResult extends TRow[TRoot] & { [key in TAgg]: TRow[TAgg][] },
// >(
//     rows: TRow[],
//     root: TRoot,
//     aggregateKey: TAgg
// ): TResult[] | undefined => {
//     if (rows.length === 0) return undefined;

//     const results: Record<string, TResult> = {};

//     for (const row of rows) {
//         if (row[root] && results[row[root].id]) {

//             if (!results[row[root].id]) {
//                 results[row[root].id] = {
//                     ...row[root],
//                     [aggregateKey]: [],
//                 };
//             }

//             results[row[root].id][aggregateKey].push(row[aggregateKey]);
//         }
//     }

//     // const result = {
//     //     ...rows[0][root],
//     //     [aggregateKey]: rows.map((row) => row[aggregateKey]),
//     // } as TResult;

//     return Object.values(results);
// };
