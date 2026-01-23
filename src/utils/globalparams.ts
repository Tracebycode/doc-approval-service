function normalizeToArray(
  value: string | string[] | undefined,
  name: string
): string[] {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return Array.isArray(value) ? value : [value];
}
