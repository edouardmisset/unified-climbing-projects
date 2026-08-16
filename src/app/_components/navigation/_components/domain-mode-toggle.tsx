'use client'

import { startTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  DOMAIN_DETAILS,
  DOMAINS,
  getDomainFromPathname,
  getDomainSwitchPath,
} from '~/constants/domain'
import styles from '../navigation.module.css'

export function DomainModeToggle({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const currentDomain = getDomainFromPathname(pathname) ?? 'ascents'

  const switchDomain = (nextDomain: (typeof DOMAINS)[number]) => {
    if (nextDomain === currentDomain) return

    const href = getDomainSwitchPath(pathname, nextDomain)

    startTransition(() => {
      router.push(href)
    })
    onNavigate?.()
  }

  return (
    <li className={styles.domainMode}>
      <p className={styles.domainModeLabel}>Current focus</p>
      <div aria-label='Current climbing focus' className={styles.domainModeControl}>
        {DOMAINS.map(domain => {
          const { icon, label } = DOMAIN_DETAILS[domain]
          const isSelected = domain === currentDomain

          return (
            <button
              aria-pressed={isSelected}
              className={styles.domainModeButton}
              data-selected={isSelected}
              key={domain}
              onClick={() => {
                switchDomain(domain)
              }}
              type='button'
            >
              <span aria-hidden className={styles.linkIcon}>
                {icon}
              </span>
              <span className={styles.domainModeText}>{label}</span>
            </button>
          )
        })}
      </div>
    </li>
  )
}
