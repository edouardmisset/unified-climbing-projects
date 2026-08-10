import { FilteredAscentList } from '~/app/_components/filtered-ascents-list/filtered-ascents-list'
import { getAllAscents } from '~/services/ascents'

export async function AscentList() {
  const ascents = await getAllAscents()
  return <FilteredAscentList ascents={ascents} />
}
