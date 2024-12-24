import styles from './footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>@edouardmisset 2024-{new Date().getFullYear()}</p>
    </footer>
  )
}
