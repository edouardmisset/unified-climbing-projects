'use client'

import { memo, type ReactNode } from 'react'
import styles from './barcode.module.css'

type BarcodeProps = {
  children: ReactNode
}

function BarcodeComponent(props: BarcodeProps) {
  const { children } = props

  return (
    <div className={styles.barcode} role='img'>
      {children}
    </div>
  )
}

export const Barcode = memo(BarcodeComponent)
