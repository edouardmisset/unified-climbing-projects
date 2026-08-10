import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader } from '~/app/_components/ui/loader/loader'
import Layout from '~/app/_components/page-layout/page-layout'
import { BarcodeContent } from './barcode-content'

export default function TrainingSessionsBarcodePage() {
  return (
    <Layout title='Training Barcode'>
      <Suspense fallback={<Loader />}>
        <BarcodeContent />
      </Suspense>
    </Layout>
  )
}

export const metadata: Metadata = {
  description: 'Barcode visualization of training sessions',
  keywords: ['climbing', 'visualization', 'training', 'barcode'],
  title: 'Training Sessions Barcode Visualization 🖼️',
}
