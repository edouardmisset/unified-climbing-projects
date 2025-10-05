/*
 * TODO: One might want to improve upon this design by creating a function that
 * generates the links which would accept parameters for dynamic segments (like
 * `/ascents/:id` or `/wrap-up/:year`).
 */
export const LINKS = {
  home: '/',
  ascentForm: '/ascent-form',
  trainingSessionForm: '/training-session-form',
  indicators: '/indicators',
  wrapUp: '/wrap-up',
  ascentsList: '/ascents',
  ascentsTopTen: '/ascents/top-ten',
  ascentsDashboard: '/ascents/dashboard',
  ascentsCalendar: '/ascents/calendar',
  ascentsBarcode: '/ascents/barcode',
  ascentsQrCode: '/ascents/qr-code',
  trainingSessionsList: '/training-sessions',
  trainingSessionsCalendar: '/training-sessions/calendar',
  trainingSessionsBarcode: '/training-sessions/barcode',
  trainingSessionsQrCode: '/training-sessions/qr-code',
} as const satisfies Record<string, string>
