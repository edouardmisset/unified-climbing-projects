import { memo, type ReactNode } from 'react'
import styles from './timeline.module.css'

function TimelineComponent({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <ul className={styles.timeline}>{children}</ul>
    </div>
  )
}
export const Timeline = memo(TimelineComponent)
