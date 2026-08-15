import type { ReactNode } from 'react'
import formStyles from '~/app/_components/forms/form.module.css'

export function Field({
  children,
  label,
  htmlFor,
  required = false,
}: {
  children: ReactNode
  htmlFor: string
  label: string
  required?: boolean
}) {
  return (
    <div className={formStyles.field}>
      <label className={required ? formStyles.requiredLabel : undefined} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  )
}
