export const createValueSetter =
  <T extends string>(setter: (value: T) => void) =>
  (value: string) =>
    setter(value as T)
