import { capitalize } from '@edouardmisset/text/capitalize.ts'
import type { ChangeEventHandler } from 'react'
import { ALL_VALUE } from '../dashboard/constants.ts'
import { Option } from '../option/option.tsx'
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
        <Option label={capitalize(ALL_VALUE)} value={ALL_VALUE} />
        {options.map(option => (
          <Option key={option} label={String(option)} value={String(option)} />
        ))}
      </select>
    </label>
  )
}
