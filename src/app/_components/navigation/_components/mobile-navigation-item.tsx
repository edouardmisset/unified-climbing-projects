import { Menu } from '@base-ui-components/react/menu'
import { Link } from '../../link/link'
import type { NavigationElement } from '../constants'
import styles from '../navigation.module.css'

export function MobileNavigationItem({ item, index }: { item: NavigationElement; index: number }) {
  if (item.type === 'link') {
    const { href, label } = item
    return (
      <Menu.Item className={styles.Item} key={href}>
        <Link href={href}>{label}</Link>
      </Menu.Item>
    )
  }

  if (item.type === 'separator') {
    return <Menu.Separator className={styles.Separator} key={`separator-${index}`} />
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
