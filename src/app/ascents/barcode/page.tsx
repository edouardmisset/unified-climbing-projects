import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { BarcodeContent } from './barcode-content'

export default function AscentBarcodePage() {
  return (
    <Layout title='Ascents Barcode'>
      <Suspense fallback={<Loader />}>
        <BarcodeContent />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Barcode visualization of climbing ascents',
  keywords: ['climbing', 'visualization', 'ascents', 'barcode'],
  title: 'Ascents Barcode Visualization 🖼️',
}
