import { Link } from '../../link/link'
import type { NavigationElement } from '../constants'
import styles from '../navigation.module.css'

export function DesktopNavigationItem({ item }: { item: NavigationElement }) {
  if (item.type === 'link') {
    const { href, label } = item
    return (
      <li key={href}>
        <Link className={styles.link} href={href}>
          {label}
        </Link>
      </li>
    )
  }

  if (item.type === 'separator') {
    return (
      <li>
        <hr className={styles.Break} />
      </li>
    )
  }

  if (item.type === 'group') {
    const { links } = item
    return (
      <>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link className={styles.link} href={href}>
              {label}
            </Link>
          </li>
        ))}
      </>
    )
  }

  return null
}
