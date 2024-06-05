'use client'

import { RefreshCcw } from 'lucide-react'

export default function Sync() {
  return (
    <button
      onClick={() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sync`, {
          method: 'POST',
        }).catch(console.error)
      }}
      type="button"
    >
      <RefreshCcw color="var(--violet-7)" />
    </button>
  )
}
