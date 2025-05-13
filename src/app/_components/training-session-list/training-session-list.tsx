import { prettyLongDate } from '~/helpers/formatters'
import { type TrainingSession, fromSessionTypeToLabel } from '~/schema/training'
import styles from '../ascent-list/ascent-list.module.css'

export function TrainingSessionList({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}): React.JSX.Element {
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
          <tr key={id} className={`${styles.row} grid-full-width`}>
            <td
              title={prettyLongDate(date, 'longDate')}
              className={`${styles.cell} monospace`}
            >
              {prettyLongDate(date, 'shortDate')}
            </td>
            <td title={gymCrag} className={styles.cell}>
              {gymCrag || '—'}
            </td>
            <td
              title={
                sessionType === undefined
                  ? undefined
                  : fromSessionTypeToLabel(sessionType)
              }
              className={styles.cell}
            >
              {sessionType === undefined
                ? '—'
                : fromSessionTypeToLabel(sessionType)}
            </td>
            <td
              title={load === undefined ? '—' : `${load}%`}
              className={styles.cell}
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
}
