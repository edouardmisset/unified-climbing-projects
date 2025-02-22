import type { ReactNode } from 'react'
import styles from './chart-container.module.css'

export function ChartContainer({
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
