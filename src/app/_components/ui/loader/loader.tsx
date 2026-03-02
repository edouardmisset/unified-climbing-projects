import styles from './loader.module.css'

export function Loader() {
  return (
    <div aria-live='polite' className={`superCenter ${styles.loader}`}>
      Loading...
    </div>
  )
}
