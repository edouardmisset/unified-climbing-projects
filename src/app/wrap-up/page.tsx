import type { Metadata } from 'next'
import WrapUp from '~/app/_components/wrap-up/wrap-up'

export default async function Page() {
  return <WrapUp />
}

export const metadata: Metadata = {
  description: 'Textual description of all my climbing ascents',
  keywords: ['climbing', 'ascents', 'description'],
  title: 'Home 🏠',
}
