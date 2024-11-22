'use server'

import type { Ascent } from '~/schema/ascent'

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
  return (
    <div id="ascents">
      <h2>
        Ascents <sup>{ascents.length}</sup>
      </h2>
      <p>
        Latest ascent: {ascents.slice(0, 1).map(ascent => ascent.routeName)}
      </p>
      <p>{duplicateAscents.length} duplicate ascents</p>
      <p>{similarAscents.length} similar ascents</p>
      <p>
        Searched for <b>"{searchedRouteName}"</b> and found{' '}
        {searchedAscents.length === 0
          ? 'nothing'
          : searchedAscents
              .slice(0, 2)
              .map(route => route.routeName)
              .join(' and ')}
      </p>
    </div>
  )
}
