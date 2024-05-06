import Link from 'next/link'

import './reset.css'
import styles from './index.module.css'

export default async function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Climbing App</h1>
        <div className={styles.linkContainer}>
          <Link className={styles.link} href="./qr-code/training">
            <h3>Training QR Code</h3>
          </Link>
          <Link className={styles.link} href="./qr-code/ascents">
            <h3>Ascent QR Code</h3>
          </Link>
          <Link
            className={styles.link}
            href={`./visualization/training/${new Date().getFullYear()}`}
          >
            <h3>Training Visualization</h3>
          </Link>
        </div>
      </div>
    </main>
  )
}
