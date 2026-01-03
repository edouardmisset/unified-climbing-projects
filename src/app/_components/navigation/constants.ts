import { LINKS } from '~/constants/links'

export const NAVIGATION_ITEMS = [
  { type: 'link', href: LINKS.home, label: '🏠 Home' },
  { type: 'link', href: LINKS.ascentForm, label: '📋 Log Ascent' },
  { type: 'link', href: LINKS.trainingSessionForm, label: '📋 Log Training' },
  { type: 'separator' },
  {
    type: 'group',
    label: '🧗 Ascents 🧗',
    links: [
      {
        type: 'link',
        href: LINKS.ascentsList,
        label: '📇 Ascents List',
        shortLabel: '📇 List',
      },
      { type: 'link', href: LINKS.ascentsTopTen, label: '🔟 Top Ten' },
      { type: 'link', href: LINKS.ascentsDashboard, label: '📊 Dashboard' },
      { type: 'link', href: LINKS.ascentsCalendar, label: '📅 Calendar' },
      {
        type: 'link',
        href: LINKS.ascentsBarcode,
        label: '🏷️ Barcode',
      },
      {
        type: 'link',
        href: LINKS.ascentsQrCode,
        label: '💠 QR Code',
      },
    ],
  },
  { type: 'separator' },
  { type: 'link', href: LINKS.indicators, label: '📈 Indicators' },
  { type: 'separator' },
  {
    type: 'group',
    label: '💪 Training 💪',
    links: [
      {
        type: 'link',
        href: LINKS.trainingSessionsList,
        label: '📇 Training List',
        shortLabel: '📇 List',
      },
      {
        type: 'link',
        href: LINKS.trainingSessionsDashboard,
        label: '📊 Dashboard',
      },
      {
        type: 'link',
        href: LINKS.trainingSessionsCalendar,
        label: '📅 Calendar',
      },
      {
        type: 'link',
        href: LINKS.trainingSessionsBarcode,
        label: '🏷️ Barcode',
      },
      {
        type: 'link',
        href: LINKS.trainingSessionsQrCode,
        label: '💠 QR Code',
      },
    ],
  },
] as const satisfies NavigationElement[]

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

export type NavigationElement =
  | NavigationLink
  | NavigationSeparator
  | NavigationGroup
