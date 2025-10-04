export const NAVIGATION_ITEMS: NavigationElement[] = [
  { type: 'link', href: '/', label: '🏠 Home' },
  { type: 'link', href: '/log-ascent', label: '📋 Log Ascent' },
  { type: 'link', href: '/log-training-session', label: '📋 Log Training' },
  { type: 'separator' },
  {
    type: 'group',
    label: '🧗 Ascents 🧗',
    links: [
      {
        type: 'link',
        href: '/ascents',
        label: '📇 Ascents List',
        shortLabel: '📇 List',
      },
      { type: 'link', href: '/ascents/top-ten', label: '🔟 Top Ten' },
      { type: 'link', href: '/ascents/dashboard', label: '📊 Dashboard' },
      { type: 'link', href: '/ascents/calendar', label: '📅 Calendar' },
      {
        type: 'link',
        href: '/ascents/barcode',
        label: '🏷️ Barcode',
      },
      {
        type: 'link',
        href: '/ascents/qr-code',
        label: '💠 QR Code',
      },
    ],
  },
  { type: 'separator' },
  { type: 'link', href: '/indicators', label: '📈 Indicators' },
  { type: 'separator' },
  {
    type: 'group',
    label: '💪 Training 💪',
    links: [
      {
        type: 'link',
        href: '/training-sessions',
        label: '📇 Training List',
        shortLabel: '📇 List',
      },
      {
        type: 'link',
        href: '/training-sessions/calendar',
        label: '📅 Calendar',
      },
      {
        type: 'link',
        href: '/training-sessions/barcode',
        label: '🏷️ Barcode',
      },
      {
        type: 'link',
        href: '/training-sessions/qr-code',
        label: '💠 QR Code',
      },
    ],
  },
] as const

type NavigationLink = {
  type: 'link'
  href: string
  label: string
  shortLabel?: string
}

type NavigationSeparator = {
  type: 'separator'
}

type NavigationGroup = {
  type: 'group'
  label: string
  links: NavigationLink[]
}

export type NavigationElement =
  | NavigationLink
  | NavigationSeparator
  | NavigationGroup
