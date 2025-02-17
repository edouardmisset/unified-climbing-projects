import type React from 'react'

import type { ReactNode } from 'react'
import styles from './barcode.module.css'

export default function Barcode(props: {
  children: ReactNode
}): React.JSX.Element {
  const { children } = props

  return (
    <div className={styles.barcode} role="img">
      {children}
    </div>
  )
}
