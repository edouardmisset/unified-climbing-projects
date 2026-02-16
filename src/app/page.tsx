import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from './_components/loader/loader'
import WrapUp from './_components/wrap-up/wrap-up'

export const revalidate = 86_400

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
