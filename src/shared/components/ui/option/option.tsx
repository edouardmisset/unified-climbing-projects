import { stringEqualsCaseInsensitive } from '@edouardmisset/text'
import { memo } from 'react'
import type { ValueAndLabel } from '~/shared/types'

function OptionComponent(props: ValueAndLabel) {
  const { value, label } = props

  const title = stringEqualsCaseInsensitive(label, value) ? label : `${label} - ${value}`
  return (
    <option title={title} value={value}>
      {label}
    </option>
  )
}

export const Option = memo(OptionComponent)
