export function commaSeparatedList(items: string[]): string {
  const length = items.length;
  if (length === 0) {
    return "";
  }
  if (length === 1) {
    return items[0];
  }
  if (length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  return `${items.slice(0, -1).join(", ")}, and ${items[length - 1]}`;
}
