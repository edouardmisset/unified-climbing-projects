'use client'

export default function Sync() {
  return (
    <button
      onClick={() => {
        fetch('https://climbing-back.deno.dev/api/sync', {
          method: 'POST',
        }).catch(console.error)
      }}
      type="button"
    >
      🔄
    </button>
  )
}
