// oxlint-disable import/no-nodejs-modules
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { playwright } from 'vite-plus/test/browser-playwright'
import { defineConfig } from 'vite-plus'

const compileTarget = 'esnext'

// Charts (recharts' ResponsiveContainer needs real layout/ResizeObserver) and
// other highly visual components (QR codes, barcodes, calendars) are
// exercised in a real browser instead of happy-dom, so they're carved out of
// the "frontend" project below and run under "components" instead.
const BROWSER_TEST_GLOB = 'src/app/_components/{charts,data-calendar,qr-code,barcode}/**/*.test.tsx'

export default defineConfig({
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
    },
    // Convex functions run in a runtime closer to Vercel's Edge Runtime than
    // to Node/happy-dom, and their tests must not load the DOM-testing setup
    // used by the frontend project, so they get their own project.
    projects: [
      {
        extends: true,
        test: {
          name: 'frontend',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: [BROWSER_TEST_GLOB],
        },
      },
      {
        extends: true,
        test: {
          environment: 'edge-runtime',
          include: ['convex/**/*.test.ts'],
          name: 'convex',
          setupFiles: [],
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
          name: 'components',
          include: [BROWSER_TEST_GLOB],
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
    ],
  },
  resolve: {
    alias: {
      '~': path.join(import.meta.dirname, './src'),
    },
  },
  run: {
    cache: {
      scripts: true,
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
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      '@shopify/eslint-plugin',
      'eslint-plugin-react-you-might-not-need-an-effect',
      'eslint-plugin-compat',
    ],
    plugins: ['react', 'jsx-a11y', 'nextjs', 'typescript', 'import', 'unicorn'],
    categories: {
      correctness: 'error',
      suspicious: 'warn',
      nursery: 'warn',
      // pedantic: 'warn',
      perf: 'warn',
      // restriction: 'warn',
      style: 'warn',
    },
    rules: {
      'eslint-plugin-compat/compat': 'error',
      '@shopify/eslint-plugin/prefer-early-return': 'error',
      'capitalized-comments': 'off',
      'eslint/arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],
      'eslint/max-params': 'error',
      'eslint/no-await-in-loop': 'warn',
      'eslint/no-duplicate-imports': 'error',
      'eslint/no-else-return': 'warn',
      'eslint/no-implicit-coercion': 'error',
      'eslint/no-return-assign': 'error',
      'func-style': 'off',
      'id-length': 'off',
      'import/consistent-type-specifier-style': 'off',
      'import/exports-last': 'off',
      'import/group-exports': 'off',
      'import/no-named-export': 'off',
      'import/prefer-default-export': 'off',
      'max-statements': 'off',
      'no-continue': 'off',
      'no-underscore-dangle': ['warn', { allow: ['_id'] }],
      'no-magic-numbers': ['warn', { ignore: [-2, -1, 0, 1, 2, 10, 24, 60, 100, 1_000, 1_900] }],
      'no-ternary': 'off',
      'no-unassigned-import': 'off',
      'operator-assignment': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': 'warn',
      'prefer-exponentiation-operator': 'warn',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/prefer-await-to-callbacks': 'warn',
      'promise/prefer-await-to-then': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
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
      'react/jsx-props-no-spreading': 'off',
      'react/no-multi-comp': 'warn',
      'react/react-in-jsx-scope': 'off',
      'sort-imports': 'off',
      'sort-keys': 'off',
      'typescript/consistent-type-definitions': ['warn', 'type'],
      'typescript/no-explicit-any': 'off',
      'typescript/no-non-null-assertion': 'warn',
      'typescript/no-unsafe-type-assertion': 'off',
      'typescript/prefer-reduce-type-parameter': 'error',
      'unicorn/no-nested-ternary': 'warn',
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
