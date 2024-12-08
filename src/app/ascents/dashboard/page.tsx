import { Suspense } from 'react'
import { Dashboard } from '~/app/_components/dashboard/dashboard'

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense>
        <Dashboard />
      </Suspense>
    </div>
  )
}
