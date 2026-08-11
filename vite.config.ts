// oxlint-disable import/no-nodejs-modules
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { playwright } from 'vite-plus/test/browser-playwright'
import { defineConfig } from 'vite-plus'

const compileTarget = 'esnext'

// React behavior belongs to the integration suite. Charts (recharts'
// ResponsiveContainer needs real layout/ResizeObserver) and other highly
// visual components are exercised in a real browser instead of happy-dom.
const BROWSER_TEST_GLOB =
  'src/app/_components/{charts,data-calendar,qr-code,barcode,ui/card}/**/*.test.tsx'
const VISUAL_TEST_GLOB =
  'src/app/_components/{charts,data-calendar,qr-code,barcode,ui/card}/**/*.visual.test.tsx'
const DOM_INTEGRATION_TEST_GLOB = 'src/**/*.test.tsx'

export default defineConfig({
  run: {
    cache: {
      scripts: true,
    },
    tasks: {
      'build:next': {
        command: 'next build',
        // Next reads its previous build state before replacing it. Source and
        // configuration inputs remain auto-tracked; generated state does not.
        input: [{ auto: true }, '!.next/**'],
        output: ['.next/**'],
      },
      'test:e2e': {
        command: 'playwright test',
        // Playwright replaces its previous report and results, while Next's dev
        // server updates .next. None of that generated state is an e2e input.
        input: [{ auto: true }, '!.next/**', '!playwright-report/**', '!test-results/**'],
        // A successful cached test run does not need generated reports restored.
        output: [],
      },
    },
  },
  plugins: [react()],
  test: {
    globals: false,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}', 'convex/**/*.ts'],
      exclude: [
        'node_modules/',
        'convex/_generated/',
        'src/backup/',
        'src/scripts/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.config.*',
        '**/types.ts',
      ],
      thresholds: {
        statements: 70,
        functions: 65,
        branches: 65,
        'convex/imports.ts': {
          statements: 90,
          functions: 85,
          branches: 80,
        },
        'src/services/imports.ts': {
          statements: 95,
          functions: 90,
          branches: 85,
        },
        'src/app/settings/{actions,export-controls,import-workspace}.{ts,tsx}': {
          statements: 85,
          functions: 80,
          branches: 75,
        },
      },
    },
    // Convex functions run in a runtime closer to Vercel's Edge Runtime than
    // to Node/happy-dom, and their tests must not load the DOM-testing setup
    // used by the frontend project, so they get their own project.
    projects: [
      {
        extends: true,
        resolve: {
          alias: {
            'server-only': path.join(import.meta.dirname, './src/testing/server-only-stub.ts'),
          },
        },
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          exclude: ['src/services/**/*.test.ts', 'src/app/**/actions.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          environment: 'edge-runtime',
          include: ['convex/**/*.test.ts'],
          name: 'integration-convex',
          setupFiles: [],
        },
      },
      {
        extends: true,
        resolve: {
          alias: {
            'server-only': path.join(import.meta.dirname, './src/testing/server-only-stub.ts'),
          },
        },
        test: {
          name: 'integration-dom',
          include: [
            DOM_INTEGRATION_TEST_GLOB,
            'src/services/**/*.test.ts',
            'src/app/**/actions.test.ts',
          ],
          exclude: [BROWSER_TEST_GLOB],
        },
      },
      {
        extends: true,
        resolve: {
          alias: {
            // See src/testing/next-image-stub.tsx for why.
            'next/image': path.join(import.meta.dirname, './src/testing/next-image-stub.tsx'),
          },
        },
        test: {
          name: 'integration-browser',
          include: [BROWSER_TEST_GLOB],
          exclude: [VISUAL_TEST_GLOB],
          environment: 'node',
          setupFiles: [],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        resolve: {
          alias: {
            'next/image': path.join(import.meta.dirname, './src/testing/next-image-stub.tsx'),
          },
        },
        test: {
          name: 'integration-visual',
          include: [VISUAL_TEST_GLOB],
          environment: 'node',
          setupFiles: ['./vitest.visual.setup.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
            viewport: { height: 720, width: 1_280 },
            expect: {
              toMatchScreenshot: {
                comparatorName: 'pixelmatch',
                comparatorOptions: { allowedMismatchedPixelRatio: 0.005 },
                resolveScreenshotPath: ({ arg, ext, root, testFileDirectory, testFileName }) =>
                  path.join(
                    root,
                    testFileDirectory,
                    '__screenshots__',
                    testFileName,
                    `${arg}-${process.platform}${ext}`,
                  ),
              },
            },
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      '~': path.join(import.meta.dirname, './src'),
    },
  },
  fmt: {
    ignorePatterns: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'convex/_generated/**',
    ],
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    singleQuote: true,
    jsxSingleQuote: true,
    arrowParens: 'avoid',
    semi: false,
    sortPackageJson: true,
  },
  lint: {
    options: {
      denyWarnings: true,
      reportUnusedDisableDirectives: 'error',
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      '@shopify/eslint-plugin',
      'eslint-plugin-react-you-might-not-need-an-effect',
      'eslint-plugin-compat',
    ],
    plugins: ['oxc', 'react', 'jsx-a11y', 'nextjs', 'typescript', 'import', 'unicorn'],
    categories: {
      correctness: 'error',
      suspicious: 'warn',
      nursery: 'warn',
      pedantic: 'warn',
      perf: 'warn',
      restriction: 'warn',
      style: 'warn',
    },
    rules: {
      'eslint-plugin-compat/compat': 'error',
      '@shopify/eslint-plugin/prefer-early-return': 'error',
      'capitalized-comments': 'off',
      'eslint/arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],
      'eslint/max-params': 'error',
      'eslint/max-lines': 'off',
      'eslint/max-lines-per-function': 'off',
      'eslint/no-await-in-loop': 'warn',
      'eslint/no-duplicate-imports': 'error',
      'eslint/no-else-return': 'warn',
      'eslint/no-implicit-coercion': 'error',
      'eslint/no-inline-comments': 'off',
      'eslint/no-plusplus': 'off',
      'eslint/prefer-object-spread': 'off',
      'eslint/no-return-assign': 'error',
      'eslint/no-undefined': 'off',
      'eslint/no-use-before-define': 'off',
      'eslint/no-console': ['warn', { allow: ['error'] }],
      'eslint/no-void': ['warn', { allowAsStatement: true }],
      'eslint/require-await': 'off',
      'func-style': 'off',
      'id-length': 'off',
      'import/consistent-type-specifier-style': 'off',
      'import/exports-last': 'off',
      'import/group-exports': 'off',
      'import/max-dependencies': 'off',
      'import/no-default-export': 'off',
      'import/no-named-export': 'off',
      'import/no-relative-parent-imports': 'off',
      'import/prefer-default-export': 'off',
      'max-statements': 'off',
      'no-continue': 'off',
      'no-underscore-dangle': ['warn', { allow: ['_id'] }],
      'no-magic-numbers': ['warn', { ignore: [-2, -1, 0, 1, 2, 10, 24, 60, 100, 1_000, 1_900] }],
      'no-ternary': 'off',
      'no-unassigned-import': 'off',
      'operator-assignment': 'error',
      // Modern syntax is part of the repository's supported Node and browser targets.
      'oxc/no-async-await': 'off',
      'oxc/no-optional-chaining': 'off',
      'oxc/no-rest-spread-properties': 'off',
      'prefer-const': 'error',
      'prefer-destructuring': 'warn',
      'prefer-exponentiation-operator': 'warn',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/prefer-await-to-callbacks': 'warn',
      'promise/prefer-await-to-then': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react/react-compiler': 'error',
      'react-you-might-not-need-an-effect/no-adjust-state-on-prop-change': 'warn',
      'react-you-might-not-need-an-effect/no-chain-state-updates': 'warn',
      'react-you-might-not-need-an-effect/no-derived-state': 'warn',
      'react-you-might-not-need-an-effect/no-event-handler': 'warn',
      'react-you-might-not-need-an-effect/no-external-store-subscription': 'warn',
      'react-you-might-not-need-an-effect/no-initialize-state': 'warn',
      'react-you-might-not-need-an-effect/no-pass-data-to-parent': 'warn',
      'react-you-might-not-need-an-effect/no-pass-live-state-to-parent': 'warn',
      'react-you-might-not-need-an-effect/no-reset-all-state-on-prop-change': 'warn',
      'react-perf/jsx-no-new-array-as-prop': 'warn',
      'react-perf/jsx-no-new-function-as-prop': 'warn',
      'react-perf/jsx-no-new-object-as-prop': 'warn',
      'react/exhaustive-deps': 'error',
      'react/jsx-max-depth': ['warn', { max: 8 }],
      'react/forbid-component-props': 'off',
      'react/jsx-filename-extension': 'off',
      'react/jsx-no-literals': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/no-multi-comp': 'warn',
      'react/react-in-jsx-scope': 'off',
      'sort-imports': 'off',
      'sort-keys': 'off',
      'typescript/consistent-type-definitions': ['warn', 'type'],
      'typescript/explicit-function-return-type': 'off',
      'typescript/explicit-member-accessibility': 'off',
      'typescript/explicit-module-boundary-types': 'off',
      'typescript/no-explicit-any': 'error',
      'typescript/no-non-null-assertion': 'warn',
      'typescript/no-unsafe-type-assertion': 'off',
      'typescript/prefer-readonly-parameter-types': 'off',
      'typescript/promise-function-async': 'off',
      'typescript/prefer-reduce-type-parameter': 'error',
      'unicorn/no-nested-ternary': 'warn',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-unreadable-array-destructuring': 'warn',
      'unicorn/prefer-array-find': 'warn',
      'unicorn/prefer-array-flat-map': 'warn',
      'unicorn/prefer-array-index-of': 'warn',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-logical-operator-over-ternary': 'error',
      'unicorn/prefer-negative-index': 'error',
      'unicorn/prefer-object-from-entries': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-set-has': 'warn',
      'unicorn/prefer-spread': 'error',
      'unicorn/prefer-ternary': 'error',
      'unicorn/require-array-join-separator': 'error',
      'typescript/consistent-return': 'off',
      'unicorn/numeric-separators-style': [
        'warn',
        {
          onlyIfContainsSeparator: false,
          number: {
            minimumDigits: 4,
            groupLength: 3,
          },
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
      complexity: 'warn',
      curly: ['error', 'multi'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
    ignorePatterns: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'test-results/**',
      'convex/_generated/**',
    ],
    overrides: [
      {
        files: ['src/app/layout.tsx'],
        rules: {
          // The blocking theme bootstrap is trusted static code, not user-provided HTML.
          'react/no-danger': 'off',
        },
      },
      {
        files: ['src/app/_components/ui/keycap-button/keycap-button.tsx'],
        rules: {
          // The forwarded button type is defaulted to the valid `button` value.
          'react/button-has-type': 'off',
        },
      },
      {
        files: ['src/style-imports.d.ts'],
        rules: {
          // An empty export marks wildcard declarations as an external module.
          'unicorn/require-module-specifiers': 'off',
        },
      },
      {
        files: ['src/app/**/{page,layout,error,not-found,loading}.tsx'],
        rules: {
          // Next.js route modules intentionally export metadata alongside components.
          'react/only-export-components': 'off',
        },
      },
      {
        files: ['**/*.{ts,tsx}'],
        rules: {
          // Type-aware checking already reports undefined TypeScript names.
          'eslint/no-undef': 'off',
        },
      },
      {
        files: ['src/**/*.test.*', 'src/**/*.spec.*'],
        plugins: ['vitest'],
        rules: {
          'import/no-nodejs-modules': 'off',
          'no-magic-numbers': 'off',
          'typescript/no-unsafe-type-assertion': 'off',
          'vitest/prefer-to-be-truthy': 'off',
          'vitest/prefer-to-be-falsy': 'off',
          'vitest/prefer-expect-assertions': 'off',
          'vitest/no-importing-vitest-globals': 'off',
          'vitest/max-expects': 'off',
          'vitest/no-conditional-in-test': 'off',
          'vitest/require-test-timeout': 'off',
          'vitest/prefer-each': 'off',
          'vitest/prefer-importing-vitest-globals': 'off',
          'vitest/prefer-called-times': 'off',
        },
      },
      {
        files: ['src/backup/**/*.ts', 'src/scripts/**/*.ts'],
        rules: {
          'jest/require-hook': 'off',
        },
      },
      {
        files: ['src/**/use*-query-state.ts'],
        rules: {
          'unicorn/no-null': 'off',
        },
      },
      {
        files: ['src/backup/**/*.ts'],

        rules: {
          'vitest/require-hook': 'off',
        },
      },
    ],
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    env: {
      builtin: true,
    },
  },
  staged: {
    '*.{js,jsx,ts,tsx}': [
      'vp check --fix',
      'vp test related --run --passWithNoTests --reporter=dot --silent=passed-only',
    ],
    '*.css': ['vp fmt', 'vp exec stylelint --fix'],
    '*.{json,jsonc,md,yaml,yml}': 'vp fmt --write',
  },
  oxc: {
    target: compileTarget,
  },
})
