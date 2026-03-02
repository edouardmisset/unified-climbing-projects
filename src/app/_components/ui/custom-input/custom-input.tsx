import { capitalize } from '@edouardmisset/text/capitalize.ts'
import type { ComponentPropsWithoutRef } from 'react'
import { CustomLabel } from '../custom-label/custom-label'
import styles from './custom-input.module.css'

type CustomInputProps = {
  name: string
}

export function CustomInput(props: CustomInputProps & ComponentPropsWithoutRef<'input'>) {
  const { value, name, id = name, title = capitalize(name), ...rest } = props

  return (
    <CustomLabel id={id} label={capitalize(name)} title={title}>
      <input
        {...rest}
        className={styles.input}
        name={name}
        id={id}
        title={value?.toString()}
        value={value}
      />
    </CustomLabel>
  )
}
