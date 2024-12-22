import type { ChangeEventHandler } from 'react'

export function createChangeHandler(
  setter: (value: string) => void,
): ChangeEventHandler<HTMLSelectElement> {
  return event => setter(event.target.value)
}
