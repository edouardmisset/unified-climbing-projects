'use client'

import { ChevronDown, type LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Link } from '../../link/link'
import type { NavigationElement } from '../constants'
import styles from '../navigation.module.css'

type NavigationDisclosureProps = {
  icon: LucideIcon
  item: Extract<NavigationElement, { type: 'disclosure' }>
  onNavigate?: () => void
  text: string
}

export function NavigationDisclosure({ icon, item, onNavigate, text }: NavigationDisclosureProps) {
  const Icon = icon
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
          <Icon size={18} strokeWidth={1.9} />
        </span>
        <span className={styles.linkText}>{text}</span>
        <ChevronDown aria-hidden className={styles.disclosureIcon} size={16} />
      </button>
      {open ? (
        <ul className={styles.disclosureLinks}>
          {item.links.map(({ href, icon: ChildIcon, label }) => (
            <li key={href}>
              <Link
                aria-label={label}
                className={styles.link}
                href={href}
                onClick={onNavigate}
                title={label}
              >
                <span aria-hidden className={styles.linkIcon}>
                  <ChildIcon size={18} strokeWidth={1.9} />
                </span>
                <span className={styles.linkText}>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : undefined}
    </li>
  )
}
