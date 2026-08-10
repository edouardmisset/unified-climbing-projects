import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { QRCodeContent } from './qr-code-content'

export default function TrainingSessionsQRCodePage() {
  return (
    <Layout title='Training QR'>
      <Suspense fallback={<Loader />}>
        <QRCodeContent />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'QR Code visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'qr code'],
  title: 'Training Sessions QR Code Visualization 🖼️',
}
