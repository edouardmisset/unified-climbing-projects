import { memo, type ReactNode } from 'react'
import styles from './page-layout.module.css'

type HeaderProps = {
  title: ReactNode
}

function HeaderComponent(props: HeaderProps) {
  const { title } = props

  return (
    <div className={`${styles.header} ${styles.patagonia}`}>
      <h1 className={styles.h1} title={typeof title === 'string' ? title : undefined}>
        {title}
      </h1>
    </div>
  )
}

export const Header = memo(HeaderComponent)
