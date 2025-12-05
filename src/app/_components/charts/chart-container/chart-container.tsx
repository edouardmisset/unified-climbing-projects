import { memo, type ReactNode, Suspense } from 'react'
import styles from './chart-container.module.css'

export const ChartContainer = memo(
  ({ children, caption }: { children: ReactNode; caption: string }) => (
    <Suspense fallback="Loading chart...">
      <figure className={`h100 ${styles.container}`}>
        {children}
        <figcaption>{caption}</figcaption>
      </figure>
    </Suspense>
  ),
)
