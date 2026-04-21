import { getAllAscents } from '~/ascents/services'
import { TableAndSelect } from './_components/table-and-select'

export async function TopTenContent() {
  const ascents = await getAllAscents()
  return <TableAndSelect ascents={ascents} />
}
