// Export main component
export { DataCalendar } from './data-calendar'

// Export types for TypeScript support
export type { 
  DataCalendarProps, 
  DataTransformConfig, 
  GroupedData 
} from './types'

// Export utilities
export { 
  defaultTransform, 
  groupDataByYear, 
  transformToCalendarEntries 
} from './helpers'

// Export pre-configured transforms
export { 
  ascentTransformConfig, 
  trainingTransformConfig 
} from './transform-configs'

// Export constants
export { 
  CALENDAR_CELL_TYPES, 
  EMPTY_CALENDAR_MESSAGES 
} from './constants'