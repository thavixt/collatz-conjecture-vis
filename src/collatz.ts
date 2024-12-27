export function getCollatzSeries(n: number): number[] {
  const collatzGenerator = createCollatzSeriesGenerator(n);
  const series = [];
  let current = collatzGenerator.next();
  while (!current.done) {
    series.push(current.value);
    current = collatzGenerator.next();
  }
  return series;
}

function * createCollatzSeriesGenerator(n: number): Generator<number> {
  yield n;

  while (n > 1) {
    if (n % 2 === 0) {
      n /= 2;
    } else {
      n = 3 * n + 1;
    }
    yield n;
  }
}

export function getNext(n: number): number {
  if (n === 1) {
    return 1;
  }

  let result = n;
  if (n % 2 === 0) {
    result /= 2;
  } else {
    result = 3 * n + 1;
  }
  return result;
}

// https://en.wikipedia.org/wiki/Collatz_conjecture
// Getting the previous value is not trivial...
// export function getPrevious(n: number): number {
//   let result = n;
//   while (n > 1) {
//     if (n % 2 === 0) {
//       n /= 2;
//     } else {
//       n = 3 * n + 1;
//     }
//     result = n;
//   }
//   return result;
// } 