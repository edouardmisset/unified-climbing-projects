import {
  fromDateToStringDate,
  getLastSaturday,
  getLastSunday,
  getYesterday,
} from '~/helpers/date.ts'

// Recent date options for the date input
// Factory function to ensure fresh dates are calculated each time
export function buildRecentDateOptions(): { label: string; value: string }[] {
  return [
    { label: 'Yesterday', value: fromDateToStringDate(getYesterday()) },
    { label: 'Last Saturday', value: fromDateToStringDate(getLastSaturday()) },
    { label: 'Last Sunday', value: fromDateToStringDate(getLastSunday()) },
  ] as const
}

/** These values determine the range of grades shown in the form dropdown beyond
 * the user's historical min/max.
 * NUMBER_OF_GRADES_BELOW_MINIMUM: Shows 6 grades easier than the user's easiest
 * climb. This allows users to log easier warmup routes or when they want to
 * climb something below their usual level
 */
export const NUMBER_OF_GRADES_BELOW_MINIMUM = 6

/** NUMBER_OF_GRADES_ABOVE_MAXIMUM: Shows 3 grades harder than the user's hardest
 * climb. This provides a reasonable projection range for users attempting harder
 * grades without overwhelming the dropdown
 */
export const NUMBER_OF_GRADES_ABOVE_MAXIMUM = 3
