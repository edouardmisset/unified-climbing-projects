import { memo, type ReactNode, Suspense } from 'react'
import styles from './chart-container.module.css'

export const ChartContainer = memo(
  ({
    children,
    className,
    caption,
  }: {
    children: ReactNode
    className?: string
    caption: string
  }) => (
    <Suspense fallback="Loading chart...">
      <figure className={`h100 ${styles.container} ${className}`}>
        {children}
        <figcaption>{caption}</figcaption>
      </figure>
    </Suspense>
  ),
)
