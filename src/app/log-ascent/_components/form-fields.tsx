import type { ComponentProps } from 'react'
import styles from './ascent-form.module.css'

type BaseFieldProps = {
  label: string
  required?: boolean
  id: string
}

type TextFieldProps = BaseFieldProps & {
  type?: 'text' | 'date' | 'number'
  placeholder?: string
  list?: string
  max?: string | number
  min?: string | number
  pattern?: string
  disabled?: boolean
  style?: ComponentProps<'input'>['style']
} & Omit<ComponentProps<'input'>, 'type' | 'id'>

export function TextField(props: TextFieldProps) {
  const {
    label,
    ref,
    required,
    id,
    type = 'text',
    className,
    ...inputProps
  } = props

  return (
    <div className={styles.field}>
      <label className={required ? 'required' : undefined} htmlFor={id}>
        {label}
      </label>
      <input
        {...inputProps}
        className={`${styles.input} contrast-color ${className || ''}`}
        enterKeyHint="next"
        id={id}
        ref={ref}
        type={type}
      />
    </div>
  )
}

type SelectFieldProps = BaseFieldProps & {
  children: React.ReactNode
} & Omit<ComponentProps<'select'>, 'id'>

export function SelectField(props: SelectFieldProps) {
  const { label, required, id, children, className, ref, ...selectProps } =
    props

  return (
    <div className={styles.field}>
      <label className={required ? 'required' : undefined} htmlFor={id}>
        {label}
      </label>
      <select
        {...selectProps}
        className={`${styles.input} contrast-color ${className || ''}`}
        enterKeyHint="next"
        id={id}
        ref={ref}
      >
        {children}
      </select>
    </div>
  )
}

type TextAreaFieldProps = BaseFieldProps & {
  placeholder?: string
} & Omit<ComponentProps<'textarea'>, 'id'>

export function TextAreaField(props: TextAreaFieldProps) {
  const { label, required, id, className, ref, ...textareaProps } = props

  return (
    <div className={styles.field}>
      <label className={required ? 'required' : undefined} htmlFor={id}>
        {label}
      </label>
      <textarea
        {...textareaProps}
        className={`${styles.input} ${styles.textarea} ${className || ''}`}
        enterKeyHint="send"
        id={id}
        ref={ref}
      />
    </div>
  )
}
