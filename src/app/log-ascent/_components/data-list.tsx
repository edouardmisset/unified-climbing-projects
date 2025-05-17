export function DataList({
  id,
  options,
}: {
  id: string
  options: string[] | readonly string[] | number[]
}): React.JSX.Element {
  return (
    <datalist id={id}>
      {options.map(option => (
        <option key={option} value={option} />
      ))}
    </datalist>
  )
}
