import type { NavigationElement } from '../constants'
import { NavigationDisclosure } from './navigation-disclosure'
import { NavigationLink } from './navigation-link'
import styles from '../navigation.module.css'

type NavigationItemProps = {
  item: NavigationElement
  onNavigate?: VoidFunction
}

export function NavigationItem({ item, onNavigate }: NavigationItemProps) {
  if (item.type === 'link')
    return <NavigationLink {...item} className={styles.item} onNavigate={onNavigate} />

  if (item.type === 'separator')
    return (
      <li className={styles.separatorItem}>
        <hr className={styles.breakLine} />
      </li>
    )

  if (item.type === 'disclosure')
    return (
      <NavigationDisclosure
        icon={item.icon}
        item={item}
        onNavigate={onNavigate}
        text={item.label}
      />
    )

  return (
    <li className={styles.group}>
      <p className={styles.groupLabel} title={item.label}>
        <span aria-hidden className={styles.linkIcon}>
          <item.icon size={18} strokeWidth={1.9} />
        </span>
        <span className={styles.groupText}>{item.label}</span>
      </p>
      <ul className={styles.groupLinks}>
        {item.links.map(link => (
          <NavigationLink key={link.href} {...link} onNavigate={onNavigate} />
        ))}
      </ul>
    </li>
  )
}
