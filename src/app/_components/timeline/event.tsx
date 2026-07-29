import { memo, type ReactNode } from 'react'
import styles from './timeline.module.css'

type EventProps = {
  title: ReactNode
  subtitle?: ReactNode
  interval: string
  children: ReactNode
}

function EventComponent(props: EventProps) {
  const { title, subtitle, interval, children } = props

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

export const Event = memo(EventComponent)
