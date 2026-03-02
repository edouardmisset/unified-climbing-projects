import type { ReactNode } from 'react'
import styles from './form-control.module.css'

type FormControlProps = {
  id: string
  label: ReactNode
  title?: string
  children: ReactNode
  className?: string
  labelClassName?: string
}

export function CustomLabel(props: FormControlProps) {
  const { id, label, title, children, className, labelClassName } = props

  const controlClassName = `${styles.control}${className ? ` ${className}` : ''}`
  const textClassName = `${styles.labelText}${labelClassName ? ` ${labelClassName}` : ''}`

  return (
    <label className={controlClassName} htmlFor={id} title={title}>
      <span className={textClassName}>{label}</span>
      {children}
    </label>
  )
}
