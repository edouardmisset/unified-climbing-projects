// Export main component
export { DataCalendar } from './data-calendar'

// Export utilities
export {
  defaultTransform,
  groupDataByYear,
  transformToCalendarEntries,
} from './helpers'

// Export pre-configured transforms
export {
  renderAscentDay,
  renderTrainingDay,
} from './render-configs'

// Export types for TypeScript support
export type {
  DataCalendarProps,
  GroupedData,
} from './types'
