import type { ReactNode } from 'react'
import type { Domain } from '~/constants/domain'
import styles from './domain-layout.module.css'

export function DomainLayout({ children, domain }: { children: ReactNode; domain: Domain }) {
  return (
    <div className={styles.scope} data-domain={domain}>
      {children}
    </div>
  )
}
