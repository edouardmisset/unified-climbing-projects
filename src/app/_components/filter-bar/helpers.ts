import type { ChangeEventHandler } from 'react'

export const createChangeHandler =
  <T extends string | number>(setter: (value: T) => void): ChangeEventHandler<HTMLSelectElement> =>
  event =>
    setter(event.target.value as T)
