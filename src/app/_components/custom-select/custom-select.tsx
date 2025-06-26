import { capitalize } from '@edouardmisset/text/capitalize.ts'
import type { ChangeEventHandler } from 'react'
import { ALL_VALUE } from '../dashboard/constants.ts'
import styles from './custom-select.module.css'

type CustomSelectProps = {
  handleChange: ChangeEventHandler<HTMLSelectElement>
  selectedOption: string
  options: string[] | number[] | readonly string[]
  name: string
  title?: string
}

export function CustomSelect(props: CustomSelectProps) {
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
        className={styles.select}
        id={name}
        onChange={handleChange}
        title={selectedOption === ALL_VALUE ? title : selectedOption}
        value={selectedOption}
      >
        <option value={ALL_VALUE}>{capitalize(ALL_VALUE)}</option>
        {options.map(option => (
          <option key={option} title={String(option)} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
