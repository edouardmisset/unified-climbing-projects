import { memo, type ReactNode } from 'react'
import styles from './timeline.module.css'

function TimelineComponent({ children, direction = 'vertical' }: { children: ReactNode, direction?: 'vertical' | 'horizontal' }) {
  return (
    <div className={styles.container}>
      <ul className={styles.timeline} data-direction={direction}>{children}</ul>
    </div>
  )
}

function EventComponent({
  title,
  subtitle,
  interval,
  children,
}: {
  title: string
  subtitle?: string
  interval: string
  children: ReactNode
}) {
  return (
    <li className={styles.event}>
      <span aria-hidden="true" className={styles.icon} />
      <div className={styles.body}>
        <p className={styles.date}>{interval}</p>
        <h3>{title}</h3>
        {subtitle && <h4>{subtitle}</h4>}
        <div className={styles.description}>{children}</div>
      </div>
    </li>
  )
}

export const Timeline = memo(TimelineComponent)
export const Event = memo(EventComponent)
