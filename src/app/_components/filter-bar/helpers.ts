import { type ChangeEventHandler, startTransition } from 'react'

export const createChangeHandler =
  <T extends string | number>(
    setter: (value: T) => void,
  ): ChangeEventHandler<HTMLSelectElement> =>
  event =>
    startTransition(() => setter(event.target.value as T))
