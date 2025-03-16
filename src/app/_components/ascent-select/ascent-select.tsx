import { capitalize } from '@edouardmisset/text/capitalize.ts'
import type { ChangeEventHandler } from 'react'
import { ALL_VALUE } from '../dashboard/constants.ts'
import styles from './ascent-select.module.css'

type AscentSelectProps = {
  handleChange: ChangeEventHandler<HTMLSelectElement>
  selectedOption: string
  options: string[] | number[] | readonly string[]
  name: string
  title?: string
}

export function AscentSelect(props: AscentSelectProps) {
  const {
    handleChange,
    selectedOption,
    options,
    name,
    title = capitalize(name),
  } = props

  return (
    <label className={styles.label} htmlFor={name} title={title}>
      {capitalize(name)}
      <select
        id={name}
        title={selectedOption === ALL_VALUE ? title : selectedOption}
        onChange={handleChange}
        value={selectedOption}
        className={styles.select}
      >
        <option value={ALL_VALUE}>{capitalize(ALL_VALUE)}</option>
        {options.map(option => {
          return (
            <option key={option} value={option} title={String(option)}>
              {option}
            </option>
          )
        })}
      </select>
    </label>
  )
}
