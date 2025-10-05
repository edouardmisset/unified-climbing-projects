import { memo } from 'react'
import { Option } from '~/app/_components/option/option'
import type { ValueAndLabel } from '~/types/generic'

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
