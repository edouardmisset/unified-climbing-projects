import {
  BarChart3,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  FileBadge,
  House,
  Dumbbell,
  Mountain,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type { Domain } from '~/constants/domain'
import { getDomainLinks } from '~/constants/links'

export function getNavigationItems(domain: Domain) {
  const links = getDomainLinks(domain)
  const visualLinks: NavigationLink[] = [
    { type: 'link', href: links.visualsQrCode, icon: Sparkles, label: 'QR Code' },
    { type: 'link', href: links.visualsBarcode, icon: FileBadge, label: 'Barcode' },
  ]
  return [
    { type: 'link', href: links.home, icon: House, label: 'Home' },
    { type: 'link', href: links.log, icon: ClipboardList, label: 'Log' },
    { type: 'separator' },
    {
      type: 'link',
      href: links.records,
      icon: domain === 'ascents' ? Mountain : Dumbbell,
      label: domain === 'ascents' ? 'Ascents' : 'Sessions',
    },
    { type: 'link', href: links.calendar, icon: CalendarDays, label: 'Calendar' },
    { type: 'link', href: links.dashboard, icon: BarChart3, label: 'Dashboard' },
    { type: 'separator' },
    {
      type: 'disclosure',
      icon: Sparkles,
      label: 'Visuals',
      links: visualLinks,
    },
    { type: 'separator' },
    { type: 'link', href: links.indicators, icon: ChartNoAxesCombined, label: 'Indicators' },
  ] as const satisfies NavigationElement[]
}

type NavigationLink = {
  type: 'link'
  href: string
  icon: LucideIcon
  label: string
}

type NavigationSeparator = {
  type: 'separator'
}

type NavigationGroup = {
  type: 'group'
  icon: LucideIcon
  label: string
  links: NavigationLink[]
}

type NavigationDisclosure = {
  type: 'disclosure'
  icon: LucideIcon
  label: string
  links: NavigationLink[]
}

export type NavigationElement =
  | NavigationLink
  | NavigationSeparator
  | NavigationGroup
  | NavigationDisclosure
