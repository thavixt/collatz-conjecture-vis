/**
 * Get a random integer - maximum is exclusive and the minimum is inclusive
 */
function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export const ANIMATION_DURATION_MS = 250;
export const TIMER_DURATION_MS = ANIMATION_DURATION_MS * 1.5;

export const DEFAULT_SEED = getRandomInt(2, 100);
export const DEFAULT_COUNT_MAP = new Map([
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
  [5, 0],
  [6, 0],
  [7, 0],
  [8, 0],
  [9, 0],
]);
