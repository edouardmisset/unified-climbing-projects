import {
  fromDateToStringDate,
  getLastSaturday,
  getLastSunday,
  getYesterday,
} from '~/helpers/date.ts'

// Recent date options for the date input
export const recentDateOptions = [
  { label: 'Yesterday', value: fromDateToStringDate(getYesterday()) },
  { label: 'Last Saturday', value: fromDateToStringDate(getLastSaturday()) },
  { label: 'Last Sunday', value: fromDateToStringDate(getLastSunday()) },
]

// Grade adjustment constants
export const NUMBER_OF_GRADES_BELOW_MINIMUM = 6
export const NUMBER_OF_GRADES_ABOVE_MAXIMUM = 3
