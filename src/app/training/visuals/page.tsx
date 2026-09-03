import { Barcode, QrCode } from 'lucide-react'
import Link from 'next/link'
import Layout from '~/app/_components/page-layout/page-layout'
import styles from '~/app/ascents/visuals/visuals.module.css'

export default function TrainingVisualsPage() {
  return (
    <Layout gridClassName={styles.visuals} title='Training visuals'>
      <p>See your training year rendered as a QR code or barcode.</p>
      <div className={styles.options}>
        <Link href='/training/visuals/qr-code'>
          <QrCode aria-hidden='true' />
          <span>QR Code</span>
        </Link>
        <Link href='/training/visuals/barcode'>
          <Barcode aria-hidden='true' />
          <span>Barcode</span>
        </Link>
      </div>
    </Layout>
  )
}
