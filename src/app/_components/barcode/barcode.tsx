import type React from 'react'

import { memo, type ReactNode } from 'react'
import styles from './barcode.module.css'

export const Barcode = memo(
  (props: { children: ReactNode }): React.JSX.Element => {
    const { children } = props

    return (
      <div className={styles.barcode} role="img">
        {children}
      </div>
    )
  },
)
