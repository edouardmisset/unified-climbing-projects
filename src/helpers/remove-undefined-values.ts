export function removeObjectExtendedNullishValues<
  T extends Record<string, unknown>,
>(obj: T): T {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return Object.entries(obj).reduce((acc: any, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value
    }
    return acc
  }, {})
}
