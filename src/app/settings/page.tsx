import { getAllAscents } from '~/services/ascents'
import { getAllTrainingSessions } from '~/services/training'
import { ExportControls } from './export-controls'

export default async function SettingsPage() {
  const [ascents, trainingSessions] = await Promise.all([getAllAscents(), getAllTrainingSessions()])

  return (
    <article>
      <h1>Settings</h1>
      <section>
        <h2>Export your data</h2>
        <p>
          The export is generated in this browser and contains exactly <code>ascents.csv</code> and{' '}
          <code>training-sessions.csv</code>.
        </p>
        <ExportControls ascents={ascents} trainingSessions={trainingSessions} />
      </section>
      <section>
        <h2>Account and deletion</h2>
        <p>
          To request account support or permanent deletion of your account and records, email{' '}
          <a href="mailto:edouardmisset@gmail.com">edouardmisset@gmail.com</a>.
        </p>
      </section>
    </article>
  )
}
