import type { Metadata } from 'next'

/**
 *  We redirect this page to visualization/ascents/calendar
 * See next.config.ts for the redirect
 */
export default async function Visualization() {
  return null
}

export const metadata: Metadata = {
  title: 'Visualization 🖼️',
  description: 'Fun visuals of all my climbing ascents and training sessions',
  keywords: [
    'climbing',
    'visualization',
    'ascents',
    'qr code',
    'training',
    'barcode',
    'calendar',
  ],
}
