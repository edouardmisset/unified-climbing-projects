import type { LucideIcon } from 'lucide-react'
import { Link } from '../../link/link'
import styles from '../navigation.module.css'

type NavigationLinkProps = {
  className?: string
  href: string
  icon: LucideIcon
  label: string
  onNavigate?: VoidFunction
}

export function NavigationLink({
  className,
  href,
  icon: Icon,
  label,
  onNavigate,
}: NavigationLinkProps) {
  return (
    <li className={className}>
      <Link
        aria-label={label}
        className={styles.link}
        href={href}
        onClick={onNavigate}
        title={label}
      >
        <span aria-hidden className={styles.linkIcon}>
          <Icon size={18} strokeWidth={1.9} />
        </span>
        <span className={styles.linkText}>{label}</span>
      </Link>
    </li>
  )
}
