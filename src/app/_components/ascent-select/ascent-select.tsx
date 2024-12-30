import { capitalize } from '@edouardmisset/text/capitalize.ts'
import type { ChangeEventHandler } from 'react'
import { addParenthesis } from '~/helpers/add-parenthesis.ts'
import { ALL_VALUE } from '../dashboard/constants.ts'

interface AscentSelectProps {
  handleChange: ChangeEventHandler<HTMLSelectElement>
  selectedOption: string
  options: string[] | number[] | readonly string[]
  name: string
  title?: string
}

export function AscentSelect({
  handleChange,
  selectedOption,
  options,
  name,
  title,
}: AscentSelectProps) {
  const titleWithFallback = title ?? capitalize(name)
  return (
    <label className="flex-column" htmlFor={name}>
      {capitalize(name)}
      <select
        id={name}
        title={titleWithFallback}
        onChange={handleChange}
        defaultValue={selectedOption}
      >
        <option value={ALL_VALUE}>
          {capitalize(ALL_VALUE)} {addParenthesis(options.length)}
        </option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
