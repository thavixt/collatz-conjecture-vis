export const DEFAULT_ANIMATION_DURATION_MS = 150;
export const DEFAULT_TIMER_DURATION_MS = DEFAULT_ANIMATION_DURATION_MS * 3;
export const DEFAULT_ANIMATION_ACTIVE = true;

export const DEFAULT_SEED = getStoredSeed();
export const MAX_SEED = 9999999;

export const DEFAULT_INCREMENT_VALUE = getStoredIncrementBy();
export const MIN_INCREMENT_VALUE = 1;
export const MAX_INCREMENT_VALUE = 10e6;

export const DEFAULT_INCREMENT_SPEED = getStoredIncrementSpeed();
export const MIN_INCREMENT_SPEED = 100; // ms
export const MAX_INCREMENT_SPEED = 1000;

export const DEFAULT_OCCURENCE_MAP = new Map([
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

export function getStoredIncrementSpeed(): number {
  const incrementSpeed = localStorage.getItem('collatz_vis_incrementSpeed');
  if (!incrementSpeed) {
    return 1;
  }
  return parseInt(incrementSpeed);
}

export function setStoredIncrementBy(incrementBy: number) {
  localStorage.setItem('collatz_vis_incrementBy', incrementBy.toString());
}

export function setStoredIncrementSpeed(incrementSpeed: number) {
  localStorage.setItem('collatz_vis_incrementSpeed', incrementSpeed.toString());
}

export function getStoredAnimationActive(): boolean {
  const animationActive = localStorage.getItem('collatz_vis_animationActive');
  if (!animationActive) {
    return DEFAULT_ANIMATION_ACTIVE;
  }
  return parseInt(animationActive) ? true : false;
}

export function setStoredAnimationActive(animationActive: boolean) {
  localStorage.setItem('collatz_vis_animationActive', (animationActive ? 1 : 0).toString());
}