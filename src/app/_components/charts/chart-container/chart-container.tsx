import { type ReactNode, memo } from 'react'
import styles from './chart-container.module.css'

function ChartContainer({
  children,
  className,
  caption,
}: { children: ReactNode; className?: string; caption: string }) {
  return (
    <figure className={`h100 ${styles.container} ${className}`}>
      {children}
      {<figcaption>{caption}</figcaption>}
    </figure>
  )
}

export default memo(ChartContainer)
