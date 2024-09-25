// inpired by https://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed

export const shuffleWithSeed = <T extends any[]>(array: T, seed: number): T => {
    let pos = array.length;
    let a;
    let b;
    while (pos) {
        b = Math.floor(random(seed) * pos--);
        a = array[pos];
        array[pos] = array[b];
        array[b] = a;
        ++seed;
    }
    return array;
};

const random = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};
