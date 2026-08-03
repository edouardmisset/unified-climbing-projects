import { calendarDateSchema } from './common'

const PARIS_TIME_ZONE = 'Europe/Paris'

const parisDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  timeZone: PARIS_TIME_ZONE,
  year: 'numeric',
})

export function toParisCalendarDate(value: string): string {
  const normalizedValue = value.trim()
  const calendarDate = calendarDateSchema.safeParse(normalizedValue)
  if (calendarDate.success) return calendarDate.data

  const timestamp = new Date(normalizedValue)
  if (Number.isNaN(timestamp.getTime())) throw new Error(`Invalid legacy date '${value}'`)

  const parts = parisDateFormatter.formatToParts(timestamp)
  const day = parts.find(({ type }) => type === 'day')?.value
  const month = parts.find(({ type }) => type === 'month')?.value
  const year = parts.find(({ type }) => type === 'year')?.value

  return calendarDateSchema.parse(`${year}-${month}-${day}`)
}
