# Climbing App

Personal climbing analytics and logging app to track ascents and training,
visualize progress, and explore performance trends.

⚠️ Work in progress and intentionally experimental. This repo is a playground
to try new libraries and patterns.

## Stack

- Next.js (App Router) + TypeScript, Bun, CSS Modules
- UI: Base UI components; Charts: Recharts; Auth: Clerk
- Data & validation: Convex database, Zod schemas
- Performance: ISR and React cache() wrappers
- Testing: vitest (unit) and Playwright (e2e)

## Getting Started

Prerequisites:

- Bun installed (recommended)

Install dependencies:

```sh
bun install
```

Start the app in development:

```sh
bun run dev
```

Note: You may need to configure environment variables (for example: Convex, Google Sheet).

## Scripts

- Lint: `bun lint`
- Format: `bun format`
- Typecheck and checks (linting, style linting, formatting, etc.): `bun check`
- Validate (checks, tests, build): `bun validate`
- Spellcheck: `bun spell`
- File lint & style lint: `bun ls-lint`, `bun style:lint`

## Testing

- Unit tests: `bun test:unit`
- E2E tests: `bun test:e2e`
- All tests: `bun test:all`

## Notable Directories

- `src/app/` — Next.js App Router pages, layouts, and route components
- `src/app/_components/` — Reusable UI components (charts, inputs, dialogs)
- `src/helpers/` — Core utilities (dates, grades, transforms) with tests
- `src/schema/` — Zod schemas for strong typing and validation
- `src/services/` — Data access layer with React cache() wrappers
- `src/data/` — Data grouping and time-based helpers
- `src/styles/` — Design tokens (`colors.css`, `sizes.css`) and CSS Modules
- `tests/` — Playwright E2E tests and reports
- `backup/` — Sample data for local development

## Development Guidelines

### Code Style & Conventions

**Naming:**

- Files: `kebab-case.ts`
- Variables: `camelCase`
- Constants: `ALL_CAPS_WITH_UNDERSCORES`
- Booleans: `isOpen`, `hasPermission`
- React Components: `PascalCase` (function declarations only)
- Hooks: `useSomething`
- Handlers: `handleClick`, `handleSubmit`

**TypeScript:**

- Avoid `any` - use proper typing or `unknown` with type guards
- Type all function return types (except React components)
- Use TypeScript generics for reusability
- Zod schemas validate all data boundaries

**Style:**

- Comments ONLY for complex logic

## TODO

### Features

<details>
<summary><strong>DONE</strong></summary>

- [x] Clicking a QR-code or Barcode should open a modal with the code, not a new
      page
- [x] Add chart showing the average (min and max) number of tries per grade
- [x] Add auth (Clerk) and protect the `/log` route
- [x] Add ability to log a training session
- [x] Update the page (tab) title when we navigate to a new page
- [x] Add toasts for success and error form submission
- [x] Add a list of all training sessions like the list of ascents. Also use
      filters (by year, by session type, by "intensity", "volume" or "load"? (high,
      medium, low))
- [x] Add database (managed database with Convex)
- [ ] ~~Add ORM (Drizzle)~~
- [x] Transform the dashboard so that it displays the list of selected ascents
      along with the charts. Each ascent should be clickable to see a modal with the
      Ascent's details (use the `AscentCard` component)

</details>
</br>

- [ ] Bonus: Implement rate limiting (use Upstash) ?

- [ ] Add error management (w/ Sentry)

- [ ] Add Analytics (Posthog)

### Performance

<details>
<summary><strong>DONE</strong></summary>

- [x] Improve caching mechanisms for better performances (`createCache`,
      Vercel's fluid computing, ...)
- [x] Use [react compiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)
- [x] Changed from tRPC to direct RSC + Convex for better performance
- [x] Added ISR (Incremental Static Regeneration) with on-demand revalidation
- [x] Implemented React cache() wrappers for service functions
- [x] Memoize costly functions (like data transformations).
- [x] Improve performances of the `Visualization` page.

</details>
</br>

### Style

<details>
<summary><strong>DONE</strong></summary>

- [x] Redo the styles of the group toggle in the ascent log page
- [x] Style the sign-in button & User Avatar button
- [x] Style the QR/Barcode buttons & the `<dialog>` elements (in the
      Visualization page)
- [x] Update the `ascents/:id` page to display a card with the ascent's details
- [ ] ~~Redo the styles of the slider of the ascent log page~~
- [x] Add dark / light theme (also add a toggle). Replace the purple theme with
      the dark theme
- [x] Create a (climbing) style component to display the style of the climb
      (`<em>{style}</em>`)
- [x] Create a (climbing) grade component to display the grade of the climb
      (`<strong>{topoGrade}</strong>`)

</details>
</br>

- [ ] Update the Dashboard page to display the charts in a carousel (use lib ?)
      and lazy load the charts

### Refactoring

<details>
<summary><strong>DONE</strong></summary>

- [x] Redo ascents table with another library (`@handsontable`)
- [x] Merge QR-Code pages and Barcode pages for training and ascents into one
      page. Use a switch to change from training to ascents. Use a button-group to
      change visualisation type (barcode or QR-code)
- [x] Switch all radix-ui components to base-ui
- [x] ~~Use [HeatJS](https://www.william-troup.com/heat-js/examples/index.html) to
      display the calendars (training and ascents). Also take the opportunity to
      stash my component somewhere and also improve it using the best practice found
      in HeatJS~~
- [x] Add the calendars (ascents and training) to the Visualization page
- [x] Change the logic for inputting the grade when logging an ascent. Use an
      input along with `+` and `-` buttons to increase or decrease the grade.
- [x] Refactor the code of the Visualization page => Maybe this should be a
      navigation page and not a dynamic content page
- [x] Change chart lib

</details>
</br>

- [ ] Refactor the form components. This needs to be more legible and
      maintainable

### Tests

<details>
<summary><strong>DONE</strong></summary>

- [x] Add unit tests for the charts data transformations helpers. This allows us
      to refactor the code to improve performance or readability without breaking
      the app
- [x] Add unit tests for the `Google Sheets` to `JS` transformer functions
- [x] Add unit tests for the functions in the `src/helpers` folder
- [x] Add smoke tests for the main pages (`/`, `Dashboard`, `Visualisation`,
      `Ascent`, `Ascents/:id`)

</details>
</br>

- [ ] Add visual non-regression tests for the following components: `graphs`,
      `calendars`, `QR-codes`, `Barcodes`, etc.
