import type { ReactNode } from 'react'
import formStyles from '~/app/_components/forms/form.module.css'

export function Field({
  children,
  label,
  htmlFor,
}: {
  children: ReactNode
  htmlFor: string
  label: string
}) {
  return (
    <div className={formStyles.field}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  )
}
