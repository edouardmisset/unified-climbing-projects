import { FR_LOCALE } from '~/constants/generic'

export const frenchNumberCollator = new Intl.NumberFormat(FR_LOCALE, {
  useGrouping: true,
})
