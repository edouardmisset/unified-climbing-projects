'use client'

import { useEffect } from 'react'

// biome-ignore lint/suspicious/noShadowRestrictedNames: This is a NextJS convention
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>Please try reloading the page or coming back later.</p>
      <button onClick={() => reset()} type="button">
        Try again
      </button>
    </div>
  )
}
