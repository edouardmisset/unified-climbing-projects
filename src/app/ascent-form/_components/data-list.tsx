import { memo } from 'react'
import { Option } from '~/shared/components/ui/option/option'
import type { ValueAndLabel } from '~/shared/types'

function DataListComponent({ id, options }: DataListProps) {
  return (
    <datalist id={id}>
      {options.map(({ value, label }) => (
        <Option key={`${value}-${label}`} label={label} value={value} />
      ))}
    </datalist>
  )
}

type DataListProps = {
  id: string
  options: ValueAndLabel[]
}

export const DataList = memo(DataListComponent)
