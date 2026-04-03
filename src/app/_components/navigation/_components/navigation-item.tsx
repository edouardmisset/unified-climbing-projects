import { Link } from '../../link/link'
import type { NavigationElement } from '../constants'
import styles from '../navigation.module.css'

export type NavigationRenderMode = 'desktop-expanded' | 'desktop-collapsed' | 'mobile'

type NavigationItemProps = {
  item: NavigationElement
  mode: NavigationRenderMode
  onNavigate?: () => void
}

function splitNavigationLabel(label: string) {
  const [icon = label, ...labelParts] = label.trim().split(/\s+/)
  return {
    icon,
    text: labelParts.join(' ') || label,
  }
}

export function NavigationItem({ item, onNavigate }: NavigationItemProps) {
  if (item.type === 'link') {
    const { href, label } = item
    const { icon, text } = splitNavigationLabel(label)

    return (
      <li className={styles.item}>
        <Link
          aria-label={label}
          className={styles.link}
          href={href}
          onClick={onNavigate}
          title={label}
        >
          <span aria-hidden className={styles.linkIcon}>
            {icon}
          </span>
          <span className={styles.linkText}>{text}</span>
        </Link>
      </li>
    )
  }

  if (item.type === 'separator')
    return (
      <li className={styles.separatorItem}>
        <hr className={styles.breakLine} />
      </li>
    )

  const { icon, text } = splitNavigationLabel(item.label)

  return (
    <li className={styles.group}>
      <p className={styles.groupLabel} title={item.label}>
        <span aria-hidden className={styles.linkIcon}>
          {icon}
        </span>
        <span className={styles.groupText}>{text}</span>
      </p>
      <ul className={styles.groupLinks}>
        {item.links.map(({ href, label }) => {
          const groupLinkLabel = splitNavigationLabel(label)

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
                  {groupLinkLabel.icon}
                </span>
                <span className={styles.linkText}>{groupLinkLabel.text}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </li>
  )
}
