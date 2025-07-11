# DataCalendar Component

A refactored, improved calendar component for visualizing time-based data with better usability, maintainability, and developer experience.

## Overview

The `DataCalendar` component has been completely refactored to provide:

- **Simplified API**: Intuitive props with better defaults
- **Better Type Safety**: Improved TypeScript support with proper constraints
- **Separation of Concerns**: Split data processing from rendering logic
- **Performance Improvements**: Better memoization and reduced re-renders
- **Maintainability**: Comprehensive testing and better code organization
- **Backward Compatibility**: Existing usage continues to work

## New Simplified API

### Basic Usage

```tsx
import { DataCalendar, ascentTransformConfig } from '~/app/_components/data-calendar'

// Simple usage with pre-configured transforms
<DataCalendar
  year={2024}
  data={ascents}
  config={ascentTransformConfig}
/>
```

### Advanced Usage

```tsx
import { DataCalendar } from '~/app/_components/data-calendar'

// Custom configuration
<DataCalendar
  year={2024}
  data={myData}
  config={{
    getBackgroundColor: (data) => data.length > 0 ? 'blue' : undefined,
    getShortText: (data) => data.length.toString(),
    getTitle: (data) => `${data.length} items`,
    getDescription: (data) => <MyCustomComponent data={data} />,
    getIsSpecialCase: (data) => data.some(item => item.isSpecial),
  }}
/>
```

### Custom Transform Function

```tsx
import { DataCalendar } from '~/app/_components/data-calendar'

const customTransform = (year: number, data: MyDataType[]) => {
  // Your custom transformation logic
  return data.map(item => ({
    date: item.date,
    backgroundColor: item.color,
    shortText: item.label,
    title: item.title,
    description: item.details,
  }))
}

<DataCalendar
  year={2024}
  data={myData}
  customTransform={customTransform}
/>
```

## Pre-configured Transforms

### Ascent Transform Config

```tsx
import { DataCalendar, ascentTransformConfig } from '~/app/_components/data-calendar'

<DataCalendar
  year={2024}
  data={ascents}
  config={ascentTransformConfig}
/>
```

### Training Transform Config

```tsx
import { DataCalendar, trainingTransformConfig } from '~/app/_components/data-calendar'

<DataCalendar
  year={2024}
  data={trainingSessions}
  config={trainingTransformConfig}
/>
```

## Type Definitions

### DataCalendarProps

```tsx
interface DataCalendarProps<T extends StringDate> {
  /** Year to display */
  year: number
  /** Array of data items with date strings */
  data: T[]
  /** Configuration for transforming data to calendar entries */
  config?: DataTransformConfig<T>
  /** Custom transformation function (advanced use case) */
  customTransform?: (year: number, data: T[]) => CalendarEntry[]
}
```

### DataTransformConfig

```tsx
interface DataTransformConfig<T extends StringDate> {
  /** Function to extract background color from data */
  getBackgroundColor?: (data: T[]) => string
  /** Function to extract short text from data */
  getShortText?: (data: T[]) => ReactNode
  /** Function to extract title from data */
  getTitle?: (data: T[]) => ReactNode
  /** Function to extract description from data */
  getDescription?: (data: T[]) => ReactNode
  /** Function to determine if this is a special case */
  getIsSpecialCase?: (data: T[]) => boolean
}
```

### CalendarEntry

```tsx
interface CalendarEntry {
  /** ISO date string for the day */
  date: string
  /** Background color for the calendar cell */
  backgroundColor?: string
  /** Detailed description shown in popovers */
  description: ReactNode
  /** Title shown on hover */
  title: ReactNode
  /** Short text displayed in the cell */
  shortText: ReactNode
  /** Whether this entry represents a special case */
  isSpecialCase?: boolean
}
```

## Utility Functions

### groupDataByYear

Groups data by year and day of year:

```tsx
import { groupDataByYear } from '~/app/_components/data-calendar'

const grouped = groupDataByYear(data)
// Returns: { [year: number]: T[][] }
```

### transformToCalendarEntries

Transforms grouped data to calendar entries:

```tsx
import { transformToCalendarEntries } from '~/app/_components/data-calendar'

const entries = transformToCalendarEntries(year, groupedData, config)
// Returns: CalendarEntry[]
```

### defaultTransform

Default transformation function:

```tsx
import { defaultTransform } from '~/app/_components/data-calendar'

const entries = defaultTransform(year, data, config)
// Returns: CalendarEntry[]
```

## Migration Guide

### From Legacy API

**Old (still supported):**
```tsx
<DataCalendar
  data={allAscents}
  dataTransformationFunction={groupDataDaysByYear}
  fromDataToCalendarEntries={(year, ascents) =>
    fromAscentsToCalendarEntries(year, ascents as Ascent[][])
  }
  year={year}
/>
```

**New (recommended):**
```tsx
<DataCalendar
  data={allAscents}
  config={ascentTransformConfig}
  year={year}
/>
```

### Benefits of Migration

1. **Simpler Code**: Fewer props, cleaner API
2. **Better Performance**: Optimized memoization
3. **Type Safety**: Better TypeScript support
4. **Reusability**: Pre-configured transforms
5. **Maintainability**: Better separation of concerns

## Testing

The component includes comprehensive unit tests:

```bash
# Run DataCalendar tests
npm test src/app/_components/data-calendar/
```

## Architecture

### File Structure

```
data-calendar/
├── data-calendar.tsx        # Main component
├── types.ts                 # Type definitions
├── helpers.ts               # Utility functions
├── transform-configs.tsx    # Pre-configured transforms
├── constants.ts             # Constants
├── index.ts                 # Exports
├── data-calendar.test.ts    # Component tests
└── helpers.test.ts          # Helper tests
```

### Key Improvements

1. **Simplified API**: Reduced complexity from complex generics to simple, intuitive props
2. **Better Defaults**: Sensible defaults that work for most use cases
3. **Type Safety**: Improved TypeScript support with proper constraints
4. **Performance**: Better memoization strategies and reduced re-renders
5. **Maintainability**: Comprehensive tests and better code organization
6. **Extensibility**: Easy to customize for specific use cases
7. **Backward Compatibility**: Existing code continues to work

## Constants

```tsx
export const EMPTY_CALENDAR_MESSAGES = {
  NO_RECORD: 'No record',
  YEAR_NOT_FOUND: 'Year not found',
} as const

export const CALENDAR_CELL_TYPES = {
  EMPTY: 'empty',
  NORMAL: 'normal',
  SPECIAL: 'special',
} as const
```

## Error Handling

The component gracefully handles:
- Empty data arrays
- Missing years
- Invalid date strings
- Configuration errors

## Performance Considerations

- **Memoization**: All expensive computations are memoized
- **Hook Optimization**: Hooks are called unconditionally to maintain React rules
- **Lazy Loading**: Large datasets are processed efficiently
- **Memory Management**: Proper cleanup and garbage collection

## Contributing

When contributing to the DataCalendar component:

1. Add comprehensive tests for new features
2. Maintain backward compatibility
3. Update documentation
4. Follow the existing code style
5. Consider performance implications

## Examples

See the usage in:
- `src/app/visualization/ascents/calendar/page.tsx`
- `src/app/visualization/training-sessions/calendar/page.tsx`