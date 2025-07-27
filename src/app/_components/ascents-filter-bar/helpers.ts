import { type ChangeEventHandler, startTransition } from 'react'

export function createChangeHandler<T>(
  setter: (value: T) => void,
): ChangeEventHandler<HTMLSelectElement> {
  return event =>
    startTransition(() => setter(event.target.value as unknown as T))
}
