import type React from 'react'

import type { StringDate } from '~/types/generic'
import type { GenericBarcodeByYearProps } from '../generic-barcode-by-year/generic-barcode-by-year'
import styles from './barcode.module.css'

type BarcodeProps<T extends StringDate, WeeklyData = T[] | undefined> = Pick<
  GenericBarcodeByYearProps<T>,
  'barRender'
> & {
  yearData: WeeklyData[]
}

export default function Barcode<T extends StringDate>(
  props: BarcodeProps<T>,
): React.JSX.Element {
  const { yearData, barRender } = props

  return (
    <div className={styles.barcode}>
      {yearData.map(item => barRender(item))}
    </div>
  )
}
