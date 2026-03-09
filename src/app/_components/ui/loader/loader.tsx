import styles from './loader.module.css'

export function Loader() {
  return (
    <span aria-live='polite' className={`superCenter ${styles.loader}`}>
      Loading...
    </span>
  )
}
