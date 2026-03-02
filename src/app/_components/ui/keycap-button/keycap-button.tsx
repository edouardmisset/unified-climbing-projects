/* Inspiration from Alvish Baldha (https://dribbble.com/shots/25117095) & Wes
Boss (https://codepen.io/wesbos/pen/jEbeNdw?editors=1100) */

import type { ComponentPropsWithoutRef } from 'react'
import styles from './keycap-button.module.css'

export function KeycapButton({
  label,
  type = 'button',
  ...otherProps
}: {
  label: string
} & ComponentPropsWithoutRef<'button'>) {
  return (
    <button {...otherProps} className={styles.button} type={type}>
      <span className={styles.text}>{label}</span>
    </button>
  )
}
