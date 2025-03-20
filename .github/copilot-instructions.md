# Copilot Instructions

## Folder structure

```
component-name
├── helpers.ts               // Contains the handler functions and all the other functions needed in the component
├── component-name.tsx       // Contains the actual component
├── component-name.module.ts // Contains the styled component
├── constants.ts             // Contains the constants used in the component
├── types.ts                 // Contains the types (props and others) used in the component or the helpers
├── hooks.ts                 // Contains the custom hooks used in the component
└── component-name.tests.ts  // Contains the unit tests for the component
```

⚠️: `default export`s are used for pages.

> Like in the example above, in a perfect world, we would be using a kebab-case
> naming convention for all folders and files, because PascalCase named
> folders/files are handled differently in the diversity of operating systems
> which may lead to bugs when working with teams using different OSs.
>
> ~ [Robin Wieruch](https://www.robinwieruch.de/react-folder-structure/)

## Naming Conventions

File names must use Kebab Case. For example, `my-file-name.js`.

Ensure that all variable names are descriptive and follow camelCase conventions.
For example, `timeoutInMs`.

Constants should be in all caps and use underscores to separate words. For example,
`DEFAULT_TIMEOUT_IN_MS`.

Boolean values should try to read as a question using `is` (most of the time) or
`has` (less frequent). For example: `isOpen`

Use **arrow functions** for callbacks only and function declarations for all
other functions.

The **exception to this is for React Components** which are Function
Declarations.

React components should be named using PascalCase. For example, `MyComponent`.

Use React function components instead of class components.

Ensure that all event handlers are defined using the `useCallback` hook for
better performance.

Use the following for naming event handler functions:
`handle<EventName>`. For example: `handleClick`

When defining a function, we use `params` for its parameters.

For example:

```ts
export const clampValueInRange = (params: ValueAndRange): number => {
  const { maximum, minimum, value } = params
  return Math.max(Math.min(value, maximum), minimum)
}
```

When defining a React Component, we use `props` for its "properties".

For example:

```tsx
export function BooleanStateGridCell(
  props: BooleanStateCellProps,
): React.JSX.Element {
  const { checked } = props
  return (
    <StyledCenterCell>
      <StyledBooleanStateCell checked={checked} />
    </StyledCenterCell>
  )
}
```

The naming convention for React's `hooks` is to start the name with
`use<NameOfTheHook>`. For example: `useBooleanState`.

## React Components structure

### Import Order

Third Party Libraries
Custom Components
Utils Imports
Constant imports

Separate each import category by one empty line

### Rules for Components

Very first line — destructure Props (if any)
Initialize State Variables — `useState`
Create Refs — `useRef`
Initialize hooks — `useAppDispatch`
Write all side effects — `useEffect`
Create `const`/`let` specific to the Component
Function definition — (if any)

Separate each section by one empty line

## Style

Destructure simple arrow functions when possible.
For example, `({ a, b }) => a + b`

ONLY include comments to explain complex logic.

Do not use `;` at the end of a line.

Use modern TypeScript features

Avoid using magic numbers or strings; instead, use named constants. For example,
`const TIMEOUT_IN_MS = 1000`.

Make sure your code is **linted**
Make sure you do not have **unused variables**
Make sure you do not have **unused imports** (or exports)
Make sure your code is **formatted**
Make sure your code passes **static code analysis** checks (type checking)

Use Biome for linting and formatting the code. For example, `biome check --fix`.

Make sure your commit message follows the **conventional commits** guidelines.
For example, `feat: add new feature` or `fix: bug fix`.
The commit message should be structured as follows:

```text
<type>: <description>

[optional body]
```

**fix**: a commit of the type `fix` patches a bug in your codebase (this
correlates with **PATCH** in Semantic Versioning).

**feat**: a commit of the type `feat` introduces a new feature to the codebase
(this correlates with **MINOR** in Semantic Versioning).

**BREAKING CHANGE**: a commit that appends a
`!` after the type/scope, introduces a breaking API change (correlating with
**MAJOR** in Semantic Versioning). A BREAKING CHANGE can be part of commits of
any type.

types other than fix: and feat: are allowed, @commitlint/config-conventional
recommends **build:, chore:, ci:, docs:, style:, refactor:, perf:, test:**, and
others.

Additional types are not mandated by the Conventional Commits specification, and
have no implicit effect in Semantic Versioning (unless they include a BREAKING
CHANGE). A scope may be provided to a commit’s type, to provide additional
contextual information and is contained within parenthesis, e.g., `feat(parser):
add ability to parse arrays.`

## Testing

Test should use poku for unit tests.

End-to-end tests should use playwright.

Ensure that you write unit tests for every new function.

Ensure that you write end-to-end tests for every new feature.

Ensure that you write tests for every bug fix.

Ensure all tests pass.

## CSS

Use CSS Modules for styling.

Use modern CSS features.

Ensure that styles are responsive.

Use the design system (variables) for [colors](../src/styles/colors.css), [sizes](../src/styles/sizes.css)...

## Documentation

## Performance

## Security

## Accessibility

## Best Practices

## Code Review

## Deployment

## Monitoring
