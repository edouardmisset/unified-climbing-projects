'use client'

import { WifiOffIcon } from 'lucide-react'
import { useOffline } from 'next/offline'
import styles from './offline-banner.module.css'

export function OfflineBanner() {
  const isOffline = useOffline()

  if (!isOffline) return

  return (
    <output className={styles.banner}>
      <WifiOffIcon aria-hidden='true' size={18} strokeWidth={2.25} />
      <span>Offline. Pending requests will retry when you reconnect.</span>
    </output>
  )
}
