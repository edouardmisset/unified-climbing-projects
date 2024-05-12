'use client'

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
      🔄
    </button>
  )
}
