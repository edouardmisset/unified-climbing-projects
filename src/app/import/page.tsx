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
      <ImportWorkspace recentJobs={recentJobs} />
    </article>
  )
}
