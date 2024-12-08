import { AscentComponent } from '~/app/_components/ascent-component/ascent-component'
import { AscentsAndDays } from '~/app/_components/ascents-and-days/ascents-and-days'
import { type Ascent, parseISODateToTemporal } from '~/schema/ascent'

export async function AscentsSummary({
  ascents,
  duplicateAscents,
  similarAscents,
  searchedAscents,
  searchedRouteName,
}: {
  ascents: Ascent[]
  duplicateAscents: string[]
  similarAscents: [string, string[]][]
  searchedAscents: Ascent[]
  searchedRouteName: string
}) {
  const numberOfSimilarAscents = similarAscents.length
  const numberOfDuplicateAscents = duplicateAscents.length
  const latestAscent = ascents.at(0) as Ascent
  const numberOfDays = new Set(
    ascents.map(({ date }) =>
      parseISODateToTemporal(date).toPlainDate().toString(),
    ),
  ).size
  return (
    <div id="ascents">
      <h2>Ascents</h2>
      <p>
        <AscentsAndDays
          numberOfAscents={ascents.length}
          numberOfDays={numberOfDays}
        />
      </p>
      <p>
        Latest ascent:{' '}
        <AscentComponent ascent={latestAscent} showGrade={true} />
      </p>
      {numberOfDuplicateAscents > 0 && (
        <p>{numberOfDuplicateAscents} duplicate ascents</p>
      )}
      {numberOfSimilarAscents > 0 && (
        <p>{numberOfSimilarAscents} similar ascents</p>
      )}
      <p>
        Searched for <b>"{searchedRouteName}"</b> and found{' '}
        {searchedAscents.length === 0 ? (
          <em>nothing</em>
        ) : (
          searchedAscents
            .slice(0, 2)
            .map(route => route.routeName)
            .join(' and ')
        )}
      </p>
    </div>
  )
}
