'use server'
import type { Ascent } from '~/schema/ascent'
import { AscentComponent } from '../ascent-component/ascent-component.tsx'

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
  return (
    <div id="ascents">
      <h2>
        Ascents <sup>{ascents.length}</sup>
      </h2>
      <p>
        Latest ascent: <AscentComponent ascent={latestAscent} />
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
