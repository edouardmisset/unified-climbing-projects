import type { Metadata } from 'next'
import WrapUp from '~/app/_components/wrap-up/wrap-up'

export default function TrainingHomePage() {
  return <WrapUp homePath='/training/home' />
}

export const metadata: Metadata = {
  description: 'Review your climbing year.',
  title: 'Home · Training',
}
