import Link from 'next/link'
import Layout from '~/app/_components/page-layout/page-layout'
import styles from './visuals.module.css'

export default function AscentsVisualsPage() {
  return (
    <Layout gridClassName={styles.visuals} title='Ascent visuals'>
      <p>See your climbing year rendered as a QR code or barcode.</p>
      <div className={styles.options}>
        <Link href='/ascents/visuals/qr-code'>💠 QR Code</Link>
        <Link href='/ascents/visuals/barcode'>🏷️ Barcode</Link>
      </div>
    </Layout>
  )
}
