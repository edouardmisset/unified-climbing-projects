import type { ReactNode } from 'react'

export default function GridLayout({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <section className="flex-column w100 ">
      <h1 className="center-text">{title}</h1>
      <div className="grid">{children}</div>
    </section>
  )
}
