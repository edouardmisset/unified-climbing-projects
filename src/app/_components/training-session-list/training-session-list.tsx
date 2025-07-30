import { memo } from 'react'
import NotFound from '~/app/not-found'
import { prettyLongDate, prettyShortDate } from '~/helpers/formatters'
import {
  fromSessionTypeToLabel,
  type TrainingSessionListProps,
} from '~/schema/training'
import styles from '../ascent-list/ascent-list.module.css'

export const TrainingSessionList = memo(
  ({ trainingSessions }: TrainingSessionListProps) => {
    if (trainingSessions.length === 0) return <NotFound />

    return (
      <table className={styles.table}>
        <thead className={`${styles.header} grid-full-width`}>
          <tr className={`${styles.headerRow} grid-full-width`}>
            <th
              className={`${styles.cell} ${styles.headerCell}`}
              title="Date of the session"
            >
              Date
            </th>
            <th
              className={`${styles.cell} ${styles.headerCell}`}
              title="Location of the session"
            >
              Location
            </th>
            <th
              className={`${styles.cell} ${styles.headerCell}`}
              title="Type of the session"
            >
              Type
            </th>
            <th
              className={`${styles.cell} ${styles.headerCell}`}
              title="Load level of the session"
            >
              Load
            </th>
          </tr>
        </thead>
        <tbody className={`${styles.body} grid-full-width`}>
          {trainingSessions.map(({ id, sessionType, date, load, gymCrag }) => (
            <tr className={`${styles.row} grid-full-width`} key={id}>
              <td
                className={`${styles.cell} monospace`}
                title={prettyLongDate(date)}
              >
                {prettyShortDate(date)}
              </td>
              <td className={styles.cell} title={gymCrag}>
                {gymCrag || '—'}
              </td>
              <td
                className={styles.cell}
                title={
                  sessionType === undefined
                    ? undefined
                    : fromSessionTypeToLabel(sessionType)
                }
              >
                {sessionType === undefined
                  ? '—'
                  : fromSessionTypeToLabel(sessionType)}
              </td>
              <td
                className={styles.cell}
                title={load === undefined ? '—' : `${load}%`}
              >
                {load === undefined ? '—' : `${load}%`}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className={`${styles.footer} grid-full-width`}>
          <tr className={`${styles.row} grid-full-width`}>
            <th className={styles.footerCell}>Total</th>
            <td className={styles.footerCell}>
              <strong>{trainingSessions.length}</strong> sessions
            </td>
          </tr>
        </tfoot>
      </table>
    )
  },
)
