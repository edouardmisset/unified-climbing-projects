import type { ReactNode } from 'react'

export function ChartContainer({
  children,
  caption,
}: { children: ReactNode; caption: string }) {
  return (
    <figure className="h100">
      {children}
      {<figcaption>{caption}</figcaption>}
    </figure>
  )
}
