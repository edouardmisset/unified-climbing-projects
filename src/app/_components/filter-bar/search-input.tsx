import { useEffect, useState } from 'react'
import { CustomInput } from '../ui/custom-input/custom-input'

const SEARCH_DEBOUNCE_MS = 200

type SearchInputProps = {
  search: string
  setSearch: (value: string) => void
  startTransition: React.TransitionStartFunction
  onDraftChange: (hasDraft: boolean) => void
  id?: string
}

export function SearchInput({
  search,
  setSearch,
  startTransition,
  onDraftChange,
  id,
}: SearchInputProps) {
  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    if (localSearch === search) return

    const timeoutId = globalThis.setTimeout(() => {
      startTransition(() => {
        setSearch(localSearch)
      })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      globalThis.clearTimeout(timeoutId)
    }
  }, [localSearch, search, setSearch, startTransition])

  return (
    <CustomInput
      name='search route'
      id={id}
      onChange={({ target: { value } }) => {
        setLocalSearch(value)
        onDraftChange(value !== search)
      }}
      placeholder='Biographie'
      type='search'
      value={localSearch}
    />
  )
}
