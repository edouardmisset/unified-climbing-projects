export const emptyStringToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v
