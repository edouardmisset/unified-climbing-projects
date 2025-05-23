type DataListProps = {
  id: string
  options: {
    value: string
    label?: string
  }[]
}

export function DataList({ id, options }: DataListProps): React.JSX.Element {
  return (
    <datalist id={id}>
      {options.map(({ value, label }) => (
        <option key={String(value)} value={String(value)}>
          {label}
        </option>
      ))}
    </datalist>
  )
}
