import { Dumbbell, Mountain, type LucideIcon } from 'lucide-react'

export const DOMAINS = ['ascents', 'training'] as const

export type Domain = (typeof DOMAINS)[number]

export const DOMAIN_DETAILS = {
  ascents: { icon: Mountain, label: 'Ascents' },
  training: { icon: Dumbbell, label: 'Training' },
} as const satisfies Record<Domain, { icon: LucideIcon; label: string }>

export function isDomain(value: string | undefined): value is Domain {
  return value !== undefined && DOMAINS.includes(value as Domain)
}

export function getDomainFromPathname(pathname: string): Domain | undefined {
  const [, domain] = pathname.split('/')
  return isDomain(domain) ? domain : undefined
}

export function getDomainPath(domain: Domain, path = ''): string {
  return `/${domain}${path}`
}

export function getDomainSwitchPath(pathname: string, targetDomain: Domain): string {
  const currentDomain = getDomainFromPathname(pathname)

  if (currentDomain === undefined) return getDomainPath(targetDomain, '/home')

  const pathAfterDomain = pathname.slice(currentDomain.length + 1)

  // A single ascent has no training counterpart yet. Keep the destination useful.
  if (pathAfterDomain.startsWith('/records/')) return getDomainPath(targetDomain)

  return getDomainPath(targetDomain, pathAfterDomain)
}
