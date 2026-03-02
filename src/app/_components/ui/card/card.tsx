import type React from 'react'
import styles from './card.module.css'

export function Card({ children }: { children: React.ReactNode }) {
  return <div className={styles.card}>{children}</div>
}
