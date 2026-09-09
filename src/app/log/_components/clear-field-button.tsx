import { XIcon } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'
import formStyles from '~/app/_components/forms/form.module.css'
import type { LogDraft } from '../draft'

export type ClearFieldName =
  | 'location'
  | 'training.comments'
  | `ascents.${number}.${'name' | 'area' | 'comments'}`

export function ClearFieldButton({ name, label }: { name: ClearFieldName; label: string }) {
  const { control, setFocus, setValue } = useFormContext<LogDraft>()
  const value = useWatch({ control, name })

  if (!value) return

  return (
    <button
      aria-label={`Clear ${label}`}
      className={formStyles.clearButton}
      onClick={() => {
        setValue(name, '', { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        setFocus(name)
      }}
      type='button'
    >
      <XIcon aria-hidden size={18} />
    </button>
  )
}
