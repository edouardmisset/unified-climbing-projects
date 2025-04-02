import { AscentList } from '~/app/_components/ascent-list/ascent-list'
import { api } from '~/trpc/server'

import styles from '../page.module.css'

export default async function Page(): Promise<React.JSX.Element> {
  const topTen = await api.ascents.getTopTen()

  return (
    <div className={styles.container}>
      <h1 className="super-center">Top Ten Ascents</h1>
      <AscentList ascents={topTen} showDetails={false} showPoints={true} />
    </div>
  )
}
