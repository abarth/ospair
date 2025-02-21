import { PRNG } from "seedrandom";

export function shuffled<T>(prng: PRNG, array: T[]): T[] {
  const result = [...array];
  shuffle(prng, result);
  return result;
}

export function shuffle<T>(prng: PRNG, array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
