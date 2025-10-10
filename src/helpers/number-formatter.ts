import { FR_LOCALE } from '~/constants/generic'

export const frenchNumberFormatter = new Intl.NumberFormat(FR_LOCALE, {
  useGrouping: true,
})
