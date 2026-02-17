import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['react', 'jsx-a11y', 'nextjs', 'typescript', 'import'],
  categories: {
    correctness: 'error',
    suspicious: 'warn',
    perf: 'warn',
    style: 'warn',
  },
  rules: {
    'id-length': 'off',
    'import/group-exports': 'off',
    'import/no-named-export': 'off',
    'import/exports-last': 'off',
    'import/prefer-default-export': 'off',
    'import/consistent-type-specifier-style': 'off',
    'max-statements': ['warn', 100],
    'no-magic-numbers': ['warn', { ignore: [-1, 0, 1, 2, 10, 24, 60, 100, 1000, 1900] }],
    'no-continue': 'off',
    'no-ternary': 'off',
    'func-style': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-max-depth': ['warn', { max: 7 }],
    'react/jsx-props-no-spreading': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'sort-imports': 'off',
    'sort-keys': 'off',
    curly: 'off',
    'capitalized-comments': 'off',
    'no-unassigned-import': 'off',
    'typescript/no-explicit-any': 'off',
    'typescript/consistent-type-definitions': 'off',
  },
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
  overrides: [
    {
      files: ['**/*.test.*', '**/*.spec.*', 'tests/**'],
      rules: {
        'no-magic-numbers': 'off',
        'typescript/no-unsafe-type-assertion': 'off',
      },
    },
  ],
  settings: {
    'jsx-a11y': {
      polymorphicPropName: null,
      components: {},
      attributes: {},
    },
    next: {
      rootDir: [],
    },
    react: {
      formComponents: [],
      linkComponents: [],
      version: null,
      componentWrapperFunctions: [],
    },
    jsdoc: {
      ignorePrivate: false,
      ignoreInternal: false,
      ignoreReplacesDocs: true,
      overrideReplacesDocs: true,
      augmentsExtendsReplacesDocs: false,
      implementsReplacesDocs: false,
      exemptDestructuredRootsFromChecks: false,
      tagNamePreference: {},
    },
    vitest: {
      typecheck: false,
    },
  },
  env: {
    builtin: true,
  },
  globals: {},
})
