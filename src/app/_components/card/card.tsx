'use server'

import type React from 'react'

import styles from './card.module.css'

export async function Card({ children }: { children: React.ReactNode }) {
  return <div className={styles.container}>{children}</div>
}
