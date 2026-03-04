import { Menu } from '@base-ui/react/menu'
import baseUiStyles from '../../ui/base-ui/base-ui-primitives.module.css'
import { Link } from '../../link/link'
import type { NavigationElement } from '../constants'
import styles from '../navigation.module.css'

type NavigationItemProps = {
  item: NavigationElement
  mode: 'desktop' | 'mobile'
}

export function NavigationItem({ item, mode }: NavigationItemProps) {
  if (item.type === 'link') {
    const { href, label } = item

    return mode === 'desktop' ? (
      <li>
        <Link className={styles.link} href={href}>
          {label}
        </Link>
      </li>
    ) : (
      <Menu.Item className={`${baseUiStyles.highlightedItem} ${styles.Item}`}>
        <Link href={href}>{label}</Link>
      </Menu.Item>
    )
  }

  if (item.type === 'separator')
    return mode === 'desktop' ? (
      <li>
        <hr className={styles.Break} />
      </li>
    ) : (
      <Menu.Separator className={styles.Separator} />
    )

  return mode === 'desktop' ? (
    <>
      {item.links.map(({ href, label }) => (
        <li key={href}>
          <Link className={styles.link} href={href}>
            {label}
          </Link>
        </li>
      ))}
    </>
  ) : (
    <Menu.Group>
      <Menu.GroupLabel className={styles.GroupLabel}>{item.label}</Menu.GroupLabel>
      {item.links.map(({ href, label, shortLabel }) => (
        <Menu.Item className={`${baseUiStyles.highlightedItem} ${styles.Item}`} key={href}>
          <Link href={href}>{shortLabel ?? label}</Link>
        </Menu.Item>
      ))}
    </Menu.Group>
  )
}
