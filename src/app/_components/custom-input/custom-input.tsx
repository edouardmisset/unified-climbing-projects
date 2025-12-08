import { capitalize } from '@edouardmisset/text/capitalize.ts'
import type { ComponentPropsWithoutRef } from 'react'
import styles from './custom-input.module.css'

type CustomInputProps = {
  name: string
}

export function CustomInput(
  props: CustomInputProps & ComponentPropsWithoutRef<'input'>,
) {
  const { value, name, id = name, title = capitalize(name), ...rest } = props

  return (
    <label className={styles.label} htmlFor={id} title={title}>
      {capitalize(name)}
      <input
        {...rest}
        className={styles.input}
        id={id}
        title={value?.toString()}
        value={value}
      />
    </label>
  )
}
