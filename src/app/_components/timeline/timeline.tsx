import { memo, type ReactNode } from 'react'
import styles from './timeline.module.css'

function TimelineComponent({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <ul className={styles.timeline}>{children}</ul>
    </div>
  )
}

function EventComponent({
  title,
  subtitle,
  interval,
  children,
}: {
  title: ReactNode
  subtitle?: ReactNode
  interval: string
  children: ReactNode
}) {
  return (
    <li className={styles.event}>
      <span aria-hidden='true' className={styles.icon} />
      <div className={styles.body}>
        <time className={styles.date}>{interval}</time>
        {Boolean(title) && <h3>{title}</h3>}
        {Boolean(subtitle) && <h4>{subtitle}</h4>}
        {children}
      </div>
    </li>
  )
}

export const Timeline = memo(TimelineComponent)
export const Event = memo(EventComponent)
