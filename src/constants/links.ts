import { type Domain, getDomainPath } from './domain'

/*
 * TODO: One might want to improve upon this design by creating a function that
 * generates the links which would accept parameters for dynamic segments (like
 * `/ascents/:id` or `/wrap-up/:year`).
 */
export const LINKS = {
  home: '/ascents/home',
  landing: '/',
  privacy: '/privacy',
  signIn: '/sign-in',
  signUp: '/sign-up',
  terms: '/terms',
  log: '/ascents/log',
  indicators: '/ascents/indicators',
  wrapUp: '/ascents/home',
  ascentsList: '/ascents',
  ascentsTopTen: '/ascents?view=top-ten',
  ascentsDashboard: '/ascents/dashboard',
  ascentsCalendar: '/ascents/calendar',
  ascentsBarcode: '/ascents/visuals/barcode',
  ascentsQrCode: '/ascents/visuals/qr-code',
  trainingSessionsList: '/training',
  trainingSessionsDashboard: '/training/dashboard',
  trainingSessionsCalendar: '/training/calendar',
  trainingSessionsBarcode: '/training/visuals/barcode',
  trainingSessionsQrCode: '/training/visuals/qr-code',
  settings: '/ascents/settings',
} as const

export function getDomainLinks(domain: Domain) {
  return {
    calendar: getDomainPath(domain, '/calendar'),
    dashboard: getDomainPath(domain, '/dashboard'),
    home: getDomainPath(domain, '/home'),
    indicators: getDomainPath(domain, '/indicators'),
    log: getDomainPath(domain, '/log'),
    records: getDomainPath(domain),
    settings: getDomainPath(domain, '/settings'),
    visuals: getDomainPath(domain, '/visuals'),
    visualsBarcode: getDomainPath(domain, '/visuals/barcode'),
    visualsQrCode: getDomainPath(domain, '/visuals/qr-code'),
  } as const
}
