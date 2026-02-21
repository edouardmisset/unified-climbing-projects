import { Menu } from '@base-ui/react/menu'
import { Link } from '../../link/link'
import type { NavigationElement } from '../constants'
import styles from '../navigation.module.css'

export function MobileNavigationItem({ item }: { item: NavigationElement }) {
  if (item.type === 'link') {
    const { href, label } = item
    return (
      <Menu.Item className={styles.Item} key={href}>
        <Link href={href}>{label}</Link>
      </Menu.Item>
    )
  }

  if (item.type === 'separator') {
    return <Menu.Separator className={styles.Separator} />
  }

  if (item.type === 'group') {
    const { label, links: items } = item
    return (
      <Menu.Group key={label}>
        <Menu.GroupLabel className={styles.GroupLabel}>{label}</Menu.GroupLabel>
        {items.map(({ href, label: itemLabel, shortLabel }) => (
          <Menu.Item className={styles.Item} key={href}>
            <Link href={href}>{shortLabel || itemLabel}</Link>
          </Menu.Item>
        ))}
      </Menu.Group>
    )
  }

  return null
}
