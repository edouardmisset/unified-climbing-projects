export const createValueSetter =
  <T extends string | number>(setter: (value: T) => void) =>
  (value: string) =>
    setter(value as T)
