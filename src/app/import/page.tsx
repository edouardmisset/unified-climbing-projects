import { getRecentImportJobs } from '~/services/imports'
import { ImportWorkspace } from './workspace'

export default async function ImportPage() {
  const recentJobs = await getRecentImportJobs()

  return (
    <article>
      <h1>Import</h1>
      <p>
        Files are parsed and previewed in your browser. The original file is never uploaded or
        logged. Confirmed canonical records are inserted in atomic batches.
      </p>
      <p>
        For 8a.nu, download your climbing-data CSV export and select “8a.nu data export” below.
        Routes and boulders, ascent style, grade, attempts, rating, height, crag, sector, date, and
        comments are converted to the canonical format.
      </p>
      <ImportWorkspace recentJobs={recentJobs} />
    </article>
  )
}
