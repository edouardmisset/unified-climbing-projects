import { getRecentImportJobs } from '~/services/imports'
import { ImportWorkspace } from './import-workspace'

export async function ImportData() {
  const recentJobs = await getRecentImportJobs()
  return <ImportWorkspace recentJobs={recentJobs} />
}
