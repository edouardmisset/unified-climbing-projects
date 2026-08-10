import { Dashboard } from '~/app/_components/dashboard/dashboard'
import { getAllAscents } from '~/services/ascents'

export async function DashboardContent() {
  const ascents = await getAllAscents()
  return <Dashboard ascents={ascents} />
}
