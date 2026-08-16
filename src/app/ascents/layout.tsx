import type { ReactNode } from 'react'
import { DomainLayout } from '~/app/_components/domain-layout/domain-layout'

export default function AscentsLayout({ children }: { children: ReactNode }) {
  return <DomainLayout domain='ascents'>{children}</DomainLayout>
}
