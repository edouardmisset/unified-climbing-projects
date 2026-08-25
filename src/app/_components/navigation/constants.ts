import type { Domain } from '~/constants/domain'
import { getDomainLinks } from '~/constants/links'

export function getNavigationItems(domain: Domain) {
  const links = getDomainLinks(domain)
  const visualLinks: NavigationLink[] = [
    { type: 'link', href: links.visualsQrCode, label: '💠 QR Code' },
    { type: 'link', href: links.visualsBarcode, label: '🏷️ Barcode' },
  ]
  return [
    { type: 'link', href: links.home, label: '🏠 Home' },
    { type: 'link', href: links.log, label: '📋 Log' },
    { type: 'separator' },
    {
      type: 'link',
      href: links.records,
      label: domain === 'ascents' ? '📇 Ascents' : '📇 Sessions',
    },
    { type: 'link', href: links.calendar, label: '📅 Calendar' },
    { type: 'link', href: links.dashboard, label: '📊 Dashboard' },
    { type: 'separator' },
    {
      type: 'disclosure',
      label: '✨ Visuals',
      links: visualLinks,
    },
    { type: 'separator' },
    { type: 'link', href: links.indicators, label: '📈 Indicators' },
    { type: 'link', href: links.settings, label: '⚙️ Settings' },
  ] as const satisfies NavigationElement[]
}

type NavigationLink = {
  type: 'link'
  href: string
  label: string
}

type NavigationSeparator = {
  type: 'separator'
}

type NavigationGroup = {
  type: 'group'
  label: string
  links: NavigationLink[]
}

type NavigationDisclosure = {
  type: 'disclosure'
  label: string
  links: NavigationLink[]
}

export type NavigationElement =
  | NavigationLink
  | NavigationSeparator
  | NavigationGroup
  | NavigationDisclosure
