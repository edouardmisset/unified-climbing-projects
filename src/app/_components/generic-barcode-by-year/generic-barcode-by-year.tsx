import { Link } from 'next-view-transitions'
import type React from 'react'
import type { StringDate } from '~/types/generic'
import Barcode from '../barcode/barcode'

export interface GenericBarcodeByYearProps<
  T extends StringDate,
  WeeklyData = T[] | undefined,
> {
  getYearData: (allData: T[]) => { [year: string]: WeeklyData[] }
  barRender: (item: WeeklyData) => React.ReactNode
  linkPrefix: string
  allData: T[]
}

export function GenericBarcodeByYear<T extends StringDate>({
  allData,
  getYearData,
  linkPrefix,
  barRender,
}: GenericBarcodeByYearProps<T>) {
  const yearlyData = getYearData(allData)

  return (
    <>
      {Object.entries(yearlyData)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, yearData]) => {
          return (
            <div key={year} className="flex-column w100">
              <h2 className="center-text">
                <Link href={`/${linkPrefix}/barcode/${year}`} prefetch={true}>
                  {year}
                </Link>
              </h2>
              <Barcode yearData={yearData} barRender={barRender} />
            </div>
          )
        })}
    </>
  )
}
