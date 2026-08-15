import { LINKS } from '~/constants/links'

export type NavigationContext = 'ascents' | 'training'

const CONTEXT_LINKS = {
  ascents: {
    list: LINKS.ascentsList,
    dashboard: LINKS.ascentsDashboard,
    calendar: LINKS.ascentsCalendar,
    barcode: LINKS.ascentsBarcode,
    qrCode: LINKS.ascentsQrCode,
  },
  training: {
    list: LINKS.trainingSessionsList,
    dashboard: LINKS.trainingSessionsDashboard,
    calendar: LINKS.trainingSessionsCalendar,
    barcode: LINKS.trainingSessionsBarcode,
    qrCode: LINKS.trainingSessionsQrCode,
  },
} as const

export function getNavigationItems(context: NavigationContext): NavigationElement[] {
  const contextLinks = CONTEXT_LINKS[context]

  return [
    { type: 'link', href: LINKS.wrapUp, label: '🏠 Wrap-up' },
    { type: 'link', href: LINKS.log, label: '📋 Log' },
    { type: 'link', href: contextLinks.calendar, label: '📅 Calendar' },
    { type: 'separator' },
    {
      type: 'group',
      label: context === 'ascents' ? '🧗 Ascents 🧗' : '💪 Training 💪',
      links: [
        {
          type: 'link',
          href: contextLinks.list,
          label: context === 'ascents' ? '📇 Ascents List' : '📇 Training List',
          shortLabel: '📇 List',
        },
        ...(context === 'ascents'
          ? [{ type: 'link' as const, href: LINKS.ascentsTopTen, label: '🔟 Top Ten' }]
          : []),
        { type: 'link', href: contextLinks.dashboard, label: '📊 Dashboard' },
      ],
    },
    { type: 'separator' },
    { type: 'link', href: LINKS.indicators, label: '📈 Indicators' },
    { type: 'separator' },
    {
      type: 'group',
      label: '🎨 Visual routes',
      links: [
        { type: 'link', href: contextLinks.barcode, label: '🏷️ Barcode' },
        { type: 'link', href: contextLinks.qrCode, label: '💠 QR Code' },
      ],
    },
    { type: 'separator' },
    { type: 'link', href: LINKS.settings, label: '⚙️ Settings' },
  ]
}

type NavigationLink = {
  type: 'link'
  href: (typeof LINKS)[keyof typeof LINKS]
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

export type NavigationElement = NavigationLink | NavigationSeparator | NavigationGroup
