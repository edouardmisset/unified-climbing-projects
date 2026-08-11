import { useEffect, useState } from 'react'
import { CustomInput } from '../ui/custom-input/custom-input'

const SEARCH_DEBOUNCE_MS = 200

type SearchInputProps = {
  search: string
  setSearch: (value: string) => void
  onDraftChange: (hasDraft: boolean) => void
  id?: string
}

export function SearchInput({ search, setSearch, onDraftChange, id }: SearchInputProps) {
  const [draft, setDraft] = useState({ source: search, value: search })
  const localSearch = draft.source === search ? draft.value : search

  useEffect(() => {
    if (localSearch === search) return

    const timeoutId = globalThis.setTimeout(() => {
      setSearch(localSearch)
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      globalThis.clearTimeout(timeoutId)
    }
  }, [localSearch, search, setSearch])

  return (
    <CustomInput
      name='search route'
      id={id}
      onChange={({ target: { value } }) => {
        setDraft({ source: search, value })
        onDraftChange(value !== search)
      }}
      placeholder='Biographie'
      type='search'
      value={localSearch}
    />
  )
}
