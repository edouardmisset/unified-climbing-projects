'use client'

import { ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Link } from '../../link/link'
import type { NavigationElement } from '../constants'
import { splitNavigationLabel } from '../helpers'
import styles from '../navigation.module.css'

type NavigationDisclosureProps = {
  icon: string
  item: Extract<NavigationElement, { type: 'disclosure' }>
  onNavigate?: () => void
  text: string
}

export function NavigationDisclosure({ icon, item, onNavigate, text }: NavigationDisclosureProps) {
  const pathname = usePathname()
  const containsActiveLink = item.links.some(({ href }) => pathname === href)
  const [open, setOpen] = useState(containsActiveLink)

  return (
    <li className={styles.disclosure}>
      <button
        aria-expanded={open}
        className={styles.disclosureTrigger}
        data-active={containsActiveLink}
        onClick={() => {
          setOpen(current => !current)
        }}
        type='button'
      >
        <span aria-hidden className={styles.linkIcon}>
          {icon}
        </span>
        <span className={styles.linkText}>{text}</span>
        <ChevronDown aria-hidden className={styles.disclosureIcon} size={16} />
      </button>
      {open ? (
        <ul className={styles.disclosureLinks}>
          {item.links.map(({ href, label }) => {
            const child = splitNavigationLabel(label)

            return (
              <li key={href}>
                <Link
                  aria-label={label}
                  className={styles.link}
                  href={href}
                  onClick={onNavigate}
                  title={label}
                >
                  <span aria-hidden className={styles.linkIcon}>
                    {child.icon}
                  </span>
                  <span className={styles.linkText}>{child.text}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : undefined}
    </li>
  )
}
