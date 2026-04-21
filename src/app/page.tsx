import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/shared/components/ui/loader/loader'
import WrapUp from '~/wrap-up/components/wrap-up/wrap-up'

export const revalidate = 3_600

export default async function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <WrapUp />
    </Suspense>
  )
}

export const metadata: Metadata = {
  description: 'Textual description of all my climbing ascents',
  keywords: ['climbing', 'ascents', 'description'],
  title: 'Home 🏠',
}
