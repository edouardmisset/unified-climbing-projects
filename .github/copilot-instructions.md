# Copilot Instructions

These instructions are designed to help you write code that adheres to the project's standards and best practices. Please follow them closely.

## Folder Structure

```
component-name
├── helpers.ts               // MUST contain handler functions and other functions needed in the component
├── component-name.tsx       // MUST contain the actual component
├── component-name.module.ts // MUST contain the styled component
├── constants.ts             // MUST contain the constants used in the component
├── types.ts                 // MUST contain the types (props and others) used in the component or the helpers
├── hooks.ts                 // MUST contain the custom hooks used in the component
└── component-name.tests.ts  // MUST contain the unit tests for the component
```

- `default export`s MUST be used for pages.
- Folders and files MUST use kebab-case to avoid cross-OS issues.
  - **Example:** `my-component/my-component.tsx`

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

- **Unit Tests:** MUST use `poku`.
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

### Deployment

- Code MUST pass CI/CD checks before deployment.
