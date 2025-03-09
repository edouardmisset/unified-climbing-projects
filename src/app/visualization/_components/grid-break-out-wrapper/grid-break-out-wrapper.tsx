import styles from './grid-break-out-wrapper.module.css'

export function GridBreakOutWrapper({
  children,
}: { children: React.ReactNode }) {
  return <div className={styles.wrapper}>{children}</div>
}
