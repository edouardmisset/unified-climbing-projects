import { getAllAscents } from '~/services/ascents'
import { TableAndSelect } from './_components/table-and-select'

export async function TopTenContent() {
  const ascents = await getAllAscents()
  return <TableAndSelect ascents={ascents} />
}
