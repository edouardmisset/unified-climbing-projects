import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { QRCodeContent } from './qr-code-content'

export default function AscentsQRCodePage() {
  return (
    <Layout title='Ascents QR'>
      <Suspense fallback={<Loader />}>
        <QRCodeContent />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'QR Code visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'qr code'],
  title: 'Ascents QR Code Visualization 🖼️',
}
