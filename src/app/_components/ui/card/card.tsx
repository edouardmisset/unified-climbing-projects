import type React from 'react'
import styles from './card.module.css'

export function Card(props: { children: React.ReactNode }) {
  return <div className={styles.card}>{props.children}</div>
}
