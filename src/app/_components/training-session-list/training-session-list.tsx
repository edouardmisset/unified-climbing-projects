
import NotFound from '~/app/not-found'
import { calculateLoad } from '~/helpers/calculate-load'
import { prettyLongDate, prettyShortDate } from '~/helpers/formatters'
import { formatNumber, formatWholePercent } from '~/helpers/number-formatter'
import type { TrainingSessionListProps } from '~/schema/training'
import styles from '../ascent-list/ascent-list.module.css'

export const TrainingSessionList = ({ trainingSessions }: TrainingSessionListProps) => {
  if (trainingSessions.length === 0) return <NotFound />

  return (
    <table className={styles.table}>
      <thead className={`${styles.header} gridFullWidth`}>
        <tr className={`${styles.headerRow} gridFullWidth`}>
          <th className={`${styles.cell} ${styles.headerCell}`} title='Date of the session'>
            Date
          </th>
          <th className={`${styles.cell} ${styles.headerCell}`} title='Location of the session'>
            Location
          </th>
          <th className={`${styles.cell} ${styles.headerCell}`} title='Type of the session'>
            Type
          </th>
          <th className={`${styles.cell} ${styles.headerCell}`} title='Load level of the session'>
            Load
          </th>
        </tr>
      </thead>
      <tbody className={`${styles.body} gridFullWidth`}>
        {trainingSessions.map(({ _id, type, date, intensity, location, volume }) => {
          const load = calculateLoad(volume, intensity)

          return (
            <tr className={`${styles.row} gridFullWidth`} key={_id}>
              <td className={`${styles.cell} monospace`} title={prettyLongDate(date)}>
                {prettyShortDate(date)}
              </td>
              <td className={styles.cell} title={location}>
                {location || '—'}
              </td>
              <td className={styles.cell} title={type}>
                {type}
              </td>
              <td
                className={styles.cell}
                title={load === undefined ? '—' : formatWholePercent(load)}
              >
                {load === undefined ? '—' : formatWholePercent(load)}
              </td>
            </tr>
          )
        })}
      </tbody>
      <tfoot className={`${styles.footer} gridFullWidth`}>
        <tr className={`${styles.row} gridFullWidth`}>
          <th className={styles.footerCell}>Total</th>
          <td className={styles.footerCell}>
            <strong>{formatNumber(trainingSessions.length)}</strong> sessions
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
