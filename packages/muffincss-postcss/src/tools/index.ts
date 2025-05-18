export function mergeResolved(
  keys: string[],
  source: { [key: string]: string[] },
): string {
  const resultSet = new Set<string>();

  for (const key of keys) {
    const prefixedKey = `.${key}`;
    const values = source[prefixedKey];
    if (Array.isArray(values) && values.length > 0) {
      values.forEach((value) => resultSet.add(value));
    } else {
      resultSet.add(key);
    }
  }

  return Array.from(resultSet).join(" ");
}
