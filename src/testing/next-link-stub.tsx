import type { ComponentProps, ReactNode } from 'react'

type LinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  children: ReactNode
  href: string
}

export default function Link({ children, href, ...props }: LinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
