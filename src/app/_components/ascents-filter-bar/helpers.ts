import type { ChangeEventHandler } from 'react'

export function createChangeHandler<T>(
  setter: (value: T) => void,
): ChangeEventHandler<HTMLSelectElement> {
  return event => setter(event.target.value as unknown as T)
}
