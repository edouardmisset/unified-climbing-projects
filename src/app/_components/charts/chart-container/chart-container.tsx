import { type ReactNode, memo } from 'react'
import styles from './chart-container.module.css'

export const ChartContainer = memo(
  ({
    children,
    className,
    caption,
  }: { children: ReactNode; className?: string; caption: string }) => (
    <figure className={`h100 ${styles.container} ${className}`}>
      {children}
      {<figcaption>{caption}</figcaption>}
    </figure>
  ),
)
