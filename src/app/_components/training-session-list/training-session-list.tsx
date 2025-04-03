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
      <thead className={styles.header}>
        <tr className={styles.headerRow}>
          <th
            className={`${styles.cell} ${styles.headerCell}`}
            title="Type of the session"
          >
            Type
          </th>
          <th
            className={`${styles.cell} ${styles.headerCell}`}
            title="Date of the session"
          >
            Date
          </th>
          <th
            className={`${styles.cell} ${styles.headerCell}`}
            title="Load level of the session"
          >
            Load
          </th>
          <th
            className={`${styles.cell} ${styles.headerCell}`}
            title="Location of the session"
          >
            Location
          </th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {trainingSessions.map(({ id, sessionType, date, load, gymCrag }) => (
          <tr key={id} className={styles.row}>
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
              title={prettyLongDate(date, 'longDate')}
              className={`${styles.cell} monospace`}
            >
              {prettyLongDate(date, 'shortDate')}
            </td>
            <td
              title={load === undefined ? '—' : `${load}%`}
              className={styles.cell}
            >
              {load === undefined ? '—' : `${load}%`}
            </td>
            <td title={gymCrag} className={styles.cell}>
              {gymCrag || '—'}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className={styles.footer}>
        <tr className={styles.row}>
          <th className={styles.footerCell}>Total</th>
          <td className={styles.footerCell}>
            <strong>{trainingSessions.length}</strong> sessions
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
