import type { PhantomUiAttributes } from '@aejkatappaja/phantom-ui'

declare module 'react/jsx-runtime' {
  namespace JSX {
    // oxlint-disable-next-line typescript/consistent-type-definitions -- JSX declaration merging requires an interface
    interface IntrinsicElements {
      'phantom-ui': PhantomUiAttributes
    }
  }
}
