import { TopTenTable } from '~/app/_components/top-ten-table/top-ten-table'
import { api } from '~/trpc/server'
import styles from '../page.module.css'

export default async function Page(): Promise<React.JSX.Element> {
  const topTen = await api.ascents.getTopTen()

  if (topTen === undefined || topTen.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className="super-center">Top Ten Ascents</h1>
        <p>No ascents available.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className="super-center">Top Ten Ascents</h1>
      <TopTenTable topTenAscents={topTen} />
    </div>
  )
}
