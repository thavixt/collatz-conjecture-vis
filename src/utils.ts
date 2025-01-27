/**
 * Get a random integer - maximum is exclusive and the minimum is inclusive
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export const ANIMATION_DURATION_MS = 250;
export const TIMER_DURATION_MS = ANIMATION_DURATION_MS * 2;
export const ANIMATION_ACTIVE = false;

export const DEFAULT_SEED = getStoredSeed();
export const MAX_SEED = 9999999;

export const DEFAULT_INCREMENT_VALUE = getStoredIncrementBy();
export const MAX_INCREMENT_VALUE = 10000;

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

export function getStoredSeed(): number {
  const seed = localStorage.getItem('collatz_vis_seed');
  if (!seed) {
    // return getRandomInt(1, 10000);
    return 1;
  }
  return parseInt(seed);
}

export function setStoredSeed(seed: number) {
  localStorage.setItem('collatz_vis_seed', seed.toString());
}

export function getStoredIncrementBy(): number {
  const incrementBy = localStorage.getItem('collatz_vis_incrementBy');
  if (!incrementBy) {
    return 1;
  }
  return parseInt(incrementBy);
}

export function setStoredIncrementBy(incrementBy: number) {
  localStorage.setItem('collatz_vis_incrementBy', incrementBy.toString());
}

export function getStoredAnimationActive(): boolean {
  const animationActive = localStorage.getItem('collatz_vis_animationActive');
  if (!animationActive) {
    return true;
  }
  return parseInt(animationActive) ? true : false;
}

export function setStoredAnimationActive(animationActive: boolean) {
  localStorage.setItem('collatz_vis_animationActive', (animationActive ? 1 : 0).toString());
}