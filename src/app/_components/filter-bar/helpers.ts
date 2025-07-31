import { type ChangeEventHandler, startTransition } from 'react'

export const createChangeHandler =
  <T>(setter: (value: T) => void): ChangeEventHandler<HTMLSelectElement> =>
  event =>
    startTransition(() => setter(event.target.value as unknown as T))
