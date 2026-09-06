import { type ReactNode, Suspense } from 'react'
import styles from './chart-container.module.css'

export function ChartContainer({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <Suspense fallback='Loading chart...'>
      <figure className={`h100 ${styles.container}`}>
        {children}
        <figcaption>{caption}</figcaption>
      </figure>
    </Suspense>
  )
}
