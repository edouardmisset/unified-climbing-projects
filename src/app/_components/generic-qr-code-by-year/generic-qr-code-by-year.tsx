import { Link } from 'next-view-transitions'
import type React from 'react'
import type { StringDate } from '~/types/generic'
import QRCode from '../qr-code/qr-code'

export interface QrCodeListProps<
  T extends StringDate,
  DailyData = T[] | undefined,
> {
  getYearData: (allData: T[]) => { [year: string]: DailyData[] }
  dotRender: (item: DailyData) => React.ReactNode
  linkPrefix: string
  allData: T[]
  processGroup?: (group: DailyData[]) => DailyData[]
}

export function GenericQrCodeByYear<T extends StringDate>({
  allData: yearData,
  getYearData,
  dotRender,
  linkPrefix,
  processGroup,
}: QrCodeListProps<T>) {
  const yearGroups = getYearData(yearData)

  return (
    <>
      {Object.entries(yearGroups)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, weeklyData]) => {
          const processedGroup = processGroup
            ? processGroup(weeklyData)
            : weeklyData
          return (
            <div key={year} className="flex-column w100">
              <h2 className="center-text">
                <Link href={`/${linkPrefix}/qr-code/${year}`} prefetch={true}>
                  {year}
                </Link>
              </h2>
              <QRCode yearData={processedGroup} dotRender={dotRender} />
            </div>
          )
        })}
    </>
  )
}
