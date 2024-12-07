// Randomly shuffle an array
export function shuffle<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function sum(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

export function average(values: number[]): number {
  return sum(values) / values.length;
}
