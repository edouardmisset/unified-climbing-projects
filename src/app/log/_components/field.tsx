import type { ReactNode } from 'react'
import formStyles from '~/app/_components/forms/form.module.css'
import { ClearFieldButton, type ClearFieldName } from './clear-field-button'

export function Field({
  children,
  clearName,
  label,
  htmlFor,
  required = false,
}: {
  children: ReactNode
  clearName?: ClearFieldName
  htmlFor: string
  label: string
  required?: boolean
}) {
  return (
    <div className={formStyles.field}>
      <label className={required ? formStyles.requiredLabel : undefined} htmlFor={htmlFor}>
        {label}
      </label>
      {clearName === undefined ? (
        children
      ) : (
        <div className={formStyles.clearableControl}>
          {children}
          <ClearFieldButton label={label} name={clearName} />
        </div>
      )}
    </div>
  )
}
