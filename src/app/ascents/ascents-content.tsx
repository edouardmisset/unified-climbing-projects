import { getAllAscents } from '~/services/ascents'
import { BrowseViews } from './browse-views'

export async function AscentList() {
  const ascents = await getAllAscents()
  return <BrowseViews ascents={ascents} />
}
