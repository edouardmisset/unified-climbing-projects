import type { ReactNode } from 'react'
import { DomainLayout } from '~/app/_components/domain-layout/domain-layout'

export default function TrainingLayout({ children }: { children: ReactNode }) {
  return <DomainLayout domain='training'>{children}</DomainLayout>
}
