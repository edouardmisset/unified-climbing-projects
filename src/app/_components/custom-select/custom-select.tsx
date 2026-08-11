import { capitalize } from '@edouardmisset/text'
import type { ChangeEventHandler } from 'react'
import { ALL_VALUE } from '../dashboard/constants.ts'
import { CustomLabel } from '../ui/custom-label/custom-label'
import { Option } from '../ui/option/option.tsx'
import styles from './custom-select.module.css'

type CustomSelectProps = {
  handleChange: ChangeEventHandler<HTMLSelectElement>
  selectedOption: string
  options: string[] | number[] | readonly string[]
  name: string
  id?: string
  title?: string
}

export function CustomSelect(props: CustomSelectProps) {
  const { handleChange, selectedOption, options, name, id = name, title = capitalize(name) } = props

  return (
    <CustomLabel id={id} label={capitalize(name)} title={title}>
      <select
        className={styles.select}
        id={id}
        onChange={handleChange}
        title={selectedOption === ALL_VALUE ? title : selectedOption}
        value={selectedOption}
      >
        <Option label={capitalize(ALL_VALUE)} value={ALL_VALUE} />
        {options.map(option => (
          <Option key={option} label={String(option)} value={String(option)} />
        ))}
      </select>
    </CustomLabel>
  )
}
