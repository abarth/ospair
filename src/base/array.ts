export function* zip<T, U>(lhs: T[], rhs: U[]): IterableIterator<[T, U]> {
  const length = Math.max(lhs.length, rhs.length);
  for (let i = 0; i < length; ++i) {
    yield [lhs[i], rhs[i]];
  }
  return length;
}
