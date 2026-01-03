# Copilot Instructions

This is a Next.js climbing analytics app focused on **European sport climbing and bouldering** using the French grading system. It features Google Sheets backend, tRPC API, and extensive data visualization with strong emphasis on type safety.

## Architecture Overview

**Data Flow:** Google Sheets → CSV/API → tRPC → React components → Nivo charts
- **Backend:** Google Sheets as database via service account authentication
- **API:** tRPC routers in `src/server/api/routers/` with strong typing
- **Frontend:** Next.js App Router with Base UI components and CSS modules
- **Auth:** Clerk with sign-in protection on `/log-*` routes
- **Type Safety:** Zod schemas validate all data boundaries and runtime validation

## Critical Systems

### Grade Conversion & Scoring
The app uses the **French climbing grade system** with point conversions:
```typescript
// French grade conversion: '7a' → 37 (number) → 700 (points)
fromGradeToNumber('7a') // 37
GRADE_TO_POINTS['7a'] // 700 + style points + discipline bonus
```
- `src/schema/ascent.ts` defines French grade mappings and point systems
- `src/helpers/grade-converter.ts` handles conversions
- Style points: Onsight (+150), Flash (+50), Redpoint (+0)
- Boulder bonus: +100 points

### Google Sheets Integration
All data flows through Google Sheets transformers:
```typescript
// src/helpers/transformers/
// GS format ↔ JS format with header mappings
transformAscentFromGSToJS(rawRow) // Sheets → typed objects
transformAscentFromJSToGS(ascent) // Form data → Sheets format
```
- Headers defined in `src/helpers/transformers/headers.ts`
- Authentication via service account in `src/services/google-sheets.ts`
- Cache data fetching with React's `cache()` for performance

### Chart Data Transformations
Chart helpers follow this pattern:
```typescript
// src/app/_components/charts/[chart-name]/get-[chart-name].ts
export function getChartData(ascents: Ascent[]): ChartDataType {
  // 1. Create grade scale from min/max grades
  // 2. Group/filter ascents 
  // 3. Transform to chart format with colors
}
```

## Component Structure

```
component-name/
├── helpers.ts               // Handler functions and component logic
├── component-name.tsx       // React component (function declaration)
├── component-name.module.css // CSS modules with design tokens
├── constants.ts             // Component constants
├── types.ts                 // TypeScript interfaces
├── hooks.ts                 // Custom hooks (prefix with 'use')
└── component-name.test.ts   // Unit tests with vitest
```

**Pages:** Use `default export`, fetch data with `api.` calls in async components

## Development Workflows

### Key Commands
```bash
bun run dev          # Development with Turbo
bun run check        # Quick validation (lint + typecheck + style) - use frequently
bun run validate     # Full validation (check + test + build)
bun run test:unit    # Vitest unit tests in src/**/*.test.ts
bun run test:e2e     # Playwright tests in tests/
```

### Data Operations
- **Backup:** `bun run scripts/backup.ts` exports Google Sheets to JSON
- **Environment:** Requires Google Sheets service account credentials
- **Schema:** Zod schemas in `src/schema/` with strict validation

### Filter Patterns
Use consistent filter helpers:
```typescript
// src/helpers/filter-*.ts pattern
filterAscents(ascents, { year: 2024, climbingDiscipline: 'Route' })
filterTrainingSessions(sessions, { sessionType: 'Out' })
```

## Design System

**CSS:** Use design tokens from `src/styles/`:
- Colors: `var(--blue-5)`, `var(--gray-800)` 
- Sizes: `var(--size-3)`, `var(--size-fluid-2)`
- Climbing-specific: `var(--route)`, `var(--boulder)`, `var(--flash)`

**Components:** Base UI components + custom wrappers in `src/app/_components/`

## Testing Patterns

**Unit Tests:** Test data transformation helpers extensively:
```typescript
// src/helpers/*.test.ts
import { expect, describe, it } from 'vitest'

describe('fromGradeToNumber', () => {
  it('converts French grades to numbers correctly', () => {
    expect(fromGradeToNumber('5a')).toBe(21)
    expect(fromGradeToNumber('6c+')).toBe(33)
  })
})
```

**E2E:** Smoke tests for main pages with Playwright

## Common Gotchas

- **Grade System:** Always use helper functions, never manual conversions
- **Google Sheets:** Headers order matters, defined in `headers.ts`
- **tRPC:** Server calls use `api.` (RSC), client uses `trpc.`
- **Caching:** React `cache()` for data fetching, 'use cache' directive
- **Auth:** Clerk `<SignedIn>` wrapper for protected routes

## TypeScript & Type Safety

**Critical Rules:**
- **Avoid `any`** - use proper typing or `unknown` with type guards
- **Type all function return types** (except React components)
- **Use TypeScript generics** to improve type inference and reusability
- **Zod schemas** validate all data boundaries and provide runtime safety

```typescript
// Good: Typed function with generic
function filterData<T extends { date: string }>(
  items: T[], 
  predicate: (item: T) => boolean
): T[] {
  return items.filter(predicate)
}

// Good: Zod validation at boundaries
const ascentSchema = z.object({
  topoGrade: gradeSchema,
  style: ascentStyleSchema,
  // ...
})
```

## Naming Conventions

- **File Names:** MUST use kebab-case.
  - **Example:** `my-file-name.ts`.
- **Variables:** MUST be descriptive and follow camelCase.
  - **Example:** `timeoutInMs`.
- **Constants:** MUST be in ALL_CAPS with underscores.
  - **Example:** `DEFAULT_TIMEOUT_IN_MS`.
- **Booleans:** MUST read as a question using `is` or `has`.
  - **Examples:** `isOpen`, `hasPermission`.
- **Functions:**
  - Arrow functions MUST be used for callbacks.
  - Function declarations SHOULD be used for all other functions.
  - React components MUST use function declarations.
- **React Components:**
  - MUST be named using PascalCase.
  - MUST be function components, NOT class components.
  - SHOULD use `useCallback` for event handlers.
  - Handlers SHOULD be prefixed with `handle<EventName>`.
    - **Example:** `handleClick`.
- **Hooks:** MUST start with `use<Name>`.
  - **Example:** `useBooleanState`.
- **Handlers:** `handle<EventName>`
- **Function Parameters:**
  - General functions MUST use `params`.

    ```ts
    export const clampValueInRange = (params: ValueAndRange): number => {
      const { maximum, minimum, value } = params
      return Math.max(Math.min(value, maximum), minimum)
    }
    ```

  - React components MUST use `props`.

    ```tsx
    export function BooleanStateGridCell(props: BooleanStateCellProps): React.JSX.Element {
      const { checked } = props
      return (
        <CenterCell>
          <StyledBooleanStateCell checked={checked} />
        </CenterCell>
      )
    }
    ```

## React Components Structure

### Import Order

Imports SHOULD follow this order, separated by an empty line:

1. Third-party libraries
2. Custom components
3. Utils imports
4. Constants imports

### Component Rules

The following structure SHOULD be followed:

1. Destructure `props` (if any)
2. Initialize state variables (`useState`)
3. Create refs (`useRef`)
4. Initialize hooks (e.g., `useAppDispatch`)
5. Write all side effects (`useEffect`)
6. Define component-specific `const`/`let` variables
7. Define functions (if any)

Each section MUST be separated by an empty line.

## Style

- Simple arrow functions SHOULD be destructured when possible.
  - **Example:** `({ a, b }) => a + b`
- Comments MUST be used only for complex logic.
- Semicolons MUST NOT be used at the end of lines.
- Modern TypeScript features SHOULD be used.
- Magic numbers or strings SHOULD be avoided; named constants SHOULD be used instead.
  - **Example:** `const TIMEOUT_IN_MS = 1000`.
- Use `for...of` instead of `forEach`.
  - **Example:** `for (const item of items) { ... }`
- Use numeric separators for numbers above 1000.
  - **Example:** `const largeNumber = 1_000`
- Use template literals over string concatenation.
  - **Example:** Prefer `` `Hello, ${name}` `` to `'Hello, ' + name`.
- Code MUST be:
  - **Linted**
  - **Free of unused variables**
  - **Free of unused imports/exports**
  - **Formatted**
  - **Passing static analysis checks**
- A linter SHOULD be used for linting.
  - **Example:** `bun run lint`
- A formatter SHOULD be used for formatting.
  - **Example:** `bun run format`

## Git Commit Guidelines

- Commit messages MUST follow **conventional commits**.
  - **Examples:**

    ```
    feat: add new feature
    fix: bug fix
    ```

- Structure:

  ```
  <type>: <description>

  [optional body]
  ```

- **Types:**
  - `fix:` for bug fixes (**PATCH** in SemVer)
  - `feat:` for new features (**MINOR** in SemVer)
  - `BREAKING CHANGE:` for breaking API changes (**MAJOR** in SemVer)
  - Other types: `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`

## Testing

- **Unit Tests:** MUST use `vitest`.
- **End-to-End Tests:** MUST use `playwright`.
- Tests MUST be written for:
  - Every new function
  - Every new feature
  - Every bug fix
- All tests MUST pass before merging.

## CSS

- **CSS Modules** MUST be used for styling.
- **Modern CSS features** SHOULD be used.
- Design system variables MUST be used for for styling (when working with `.css` files) ONLY:
  - Colors: [colors.css](../src/styles/colors.css)
  - Sizes: [sizes.css](../src/styles/sizes.css)

## Other Guidelines

### Documentation

- Code SHOULD ONLY be documented where necessary. Only add comments when the
  code is unclear or uses a particular algorithm.

### Performance

- Code SHOULD be optimized for performance.
  - **Example**: Use `for...of` instead of `.forEach(...)`
- Expensive computations SHOULD use memoization (`useMemo`).

### Security

- Security best practices MUST be followed.
- Sensitive data MUST NOT be hardcoded.

### Accessibility

- Components MUST be accessible (ARIA attributes, keyboard navigation, etc.).

### Best Practices

- Follow DRY (**Don’t Repeat Yourself**) principle. This is particularly true for test cases.
- Follow SOLID principles where applicable.
- Use destructuring for objects and arrays whenever possible.
- For functions with more than 2 parameters, consider using a single object parameter to improve readability.

### Deployment

- Code MUST pass CI/CD checks before deployment.
