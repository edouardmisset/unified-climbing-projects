import { Link as NextLink } from 'next-view-transitions'
import { type ReactNode, memo } from 'react'
import styles from './link.module.css'

export const Link = memo(
  ({ href, children, ...props }: { children: ReactNode; href: string }) => {
    return (
      <NextLink href={href} {...props} prefetch={true} className={styles.Link}>
        {children}
      </NextLink>
    )
  },
)
