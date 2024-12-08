import { setDifference } from '@edouardmisset/array/sets.ts'
import {
  transformAscentFromGSToJS,
  transformAscentFromJSToGS,
} from '~/helpers/transformers/transformers'
import { type Ascent, holds, holdsFromGS } from '~/schema/ascent'

import { Temporal } from '@js-temporal/polyfill'
import { assert, describe, it } from 'poku'
import type { GSAscentRecord } from './headers.ts'

const customDeepEquals = <
  T extends Record<string, unknown>,
  Keys extends keyof T = keyof T,
>(
  leftObj: T,
  rightObj: T,
  removedKeys: Keys[],
) => {
  for (const key of removedKeys) {
    delete leftObj[key]
    delete rightObj[key]
  }
  assert.deepEqual(leftObj, rightObj)
}

describe('transformAscentFromJSToGS', () => {
  it('should transform boulder ascents', () => {
    const boulderingAscent: Omit<Ascent, 'id'> = {
      style: 'Flash',
      tries: 1,
      climber: 'Edouard Misset',
      crag: 'Fontainebleau',
      climbingDiscipline: 'Boulder',
      topoGrade: '6a',
      area: 'Le Cul de Chien',
      routeName: 'La Marie Rose',
      date: new Temporal.PlainDateTime(2024, 10, 30, 12, 0).toString(),
      rating: 5,
      comments: 'Great climb!',
      profile: 'Overhang',
      holds: 'Sloper',
      personalGrade: '6a',
      region: 'Île-de-France',
    }

    const expectedGSRecord = {
      Climber: 'Edouard Misset',
      '# Tries': '01 Flash',
      Crag: 'Fontainebleau',
      'Route / Boulder': 'Bouldering',
      'Topo Grade': '6a',
      Area: 'Le Cul de Chien',
      'Route Name': 'La Marie Rose',
      Date: '30/10/2024',
      Rating: '5*',
      'Ascent Comments': 'Great climb!',
      Profile: 'Overhang',
      Holds: 'Sloper',
      'My Grade': '6a',
      Height: '',
      Departement: 'Île-de-France',
    } satisfies GSAscentRecord

    customDeepEquals(
      transformAscentFromJSToGS(boulderingAscent as Ascent),
      expectedGSRecord,
      ['Date'],
    )
  })
  it('should transform route ascents', () => {
    const routeAscent: Omit<Ascent, 'id'> = {
      style: 'Redpoint',
      tries: 3,
      climber: 'Edouard Misset',
      crag: 'Balme de Yenne',
      climbingDiscipline: 'Route',
      topoGrade: '8a',
      area: 'Secteur 13',
      routeName: 'Bonobo',
      date: new Temporal.PlainDateTime(2022, 5, 10, 12, 0).toString(), // 2022-05-10T12:00:00.000Z
      profile: 'Overhang',
      holds: 'Pinch',
      personalGrade: '7a',
      region: 'ARA',
      height: 20,
    }

    const expectedGSRecord = {
      '# Tries': '03 go',
      Area: 'Secteur 13',
      'Ascent Comments': '',
      Climber: 'Edouard Misset',
      Crag: 'Balme de Yenne',
      Date: '10/05/2022',
      Departement: 'ARA',
      Height: '20m',
      Holds: 'Pinch',
      'My Grade': '7a',
      Profile: 'Overhang',
      Rating: '',
      'Route / Boulder': 'Route',
      'Route Name': 'Bonobo',
      'Topo Grade': '8a',
    } satisfies GSAscentRecord

    customDeepEquals(
      transformAscentFromJSToGS(routeAscent as Ascent),
      expectedGSRecord,
      ['Date'],
    )
  })

  it('should handle edge case with undefined values', () => {
    const undefinedAscent: Omit<Ascent, 'id'> = {
      style: 'Onsight',
      tries: 1,
      climber: 'Edouard Misset',
      crag: 'Ceuse',
      climbingDiscipline: 'Route',
      topoGrade: '7b+',
      area: 'Berlin',
      routeName: 'Biographie',
      date: new Temporal.PlainDateTime(2023, 7, 15, 8, 0).toString(), // 2023-07-15T08:00:00.000Z
      profile: undefined,
      holds: undefined,
      personalGrade: undefined,
      region: undefined,
      height: undefined,
      rating: undefined,
      comments: undefined,
    }

    const expectedGSRecord = {
      Climber: 'Edouard Misset',
      '# Tries': '001 Onsight',
      Crag: 'Ceuse',
      'Route / Boulder': 'Route',
      'Topo Grade': '7b+',
      Area: 'Berlin',
      'Route Name': 'Biographie',
      Date: '15/07/2023',
      Rating: '',
      'Ascent Comments': '',
      Profile: '',
      Holds: '',
      'My Grade': '',
      Height: '',
      Departement: '',
    } satisfies GSAscentRecord

    customDeepEquals(
      transformAscentFromJSToGS(undefinedAscent as Ascent),
      expectedGSRecord,
      ['Date'],
    )
  })
})

describe('transformAscentFromGSToJS', () => {
  it('should transform boulder ascents', () => {
    const boulderingGSRecord: GSAscentRecord = {
      Climber: 'Edouard Misset',
      '# Tries': '01 Flash',
      Crag: 'Fontainebleau',
      'Route / Boulder': 'Bouldering',
      'Topo Grade': '6a',
      Area: 'Le Cul de Chien',
      'Route Name': 'La Marie Rose',
      Date: '30/10/2024',
      Rating: '5*',
      'Ascent Comments': 'Great climb!',
      Profile: 'Overhang',
      Holds: 'Sloper',
      'My Grade': '6a',
      Height: '',
      Departement: 'Île-de-France',
    }

    const expectedAscent: Omit<Ascent, 'id'> = {
      style: 'Flash',
      tries: 1,
      climber: 'Edouard Misset',
      crag: 'Fontainebleau',
      climbingDiscipline: 'Boulder',
      topoGrade: '6a',
      area: 'Le Cul de Chien',
      routeName: 'La Marie Rose',
      date: new Temporal.PlainDateTime(2024, 10, 30, 12, 0).toString(), // '2024-10-30T12:00:00.000Z',
      rating: 5,
      comments: 'Great climb!',
      profile: 'Overhang',
      holds: 'Sloper',
      personalGrade: '6a',
      region: 'Île-de-France',
    }

    customDeepEquals(
      transformAscentFromGSToJS(boulderingGSRecord),
      expectedAscent,
      ['date', 'id'],
    )
  })

  it('should transform route ascents', () => {
    const routeGSRecord: GSAscentRecord = {
      '# Tries': '03 go',
      Area: 'Secteur 13',
      'Ascent Comments': '',
      Climber: 'Edouard Misset',
      Crag: 'Balme de Yenne',
      Date: '10/05/2022',
      Departement: 'ARA',
      Height: '20m',
      Holds: 'Pinch',
      'My Grade': '7a',
      Profile: 'Overhang',
      Rating: '',
      'Route / Boulder': 'Route',
      'Route Name': 'Bonobo',
      'Topo Grade': '8a',
    }

    const expectedAscent: Omit<Ascent, 'id'> = {
      style: 'Redpoint',
      tries: 3,
      climber: 'Edouard Misset',
      crag: 'Balme de Yenne',
      climbingDiscipline: 'Route',
      topoGrade: '8a',
      area: 'Secteur 13',
      routeName: 'Bonobo',
      date: new Temporal.PlainDateTime(2022, 5, 10, 12, 0).toString(), // 2022-05-10T12:00:00.000Z
      profile: 'Overhang',
      holds: 'Pinch',
      personalGrade: '7a',
      region: 'ARA',
      height: 20,
    }

    const { _id, ...actualAscent } = transformAscentFromGSToJS(routeGSRecord)

    customDeepEquals(actualAscent, expectedAscent, ['date', 'id'])
  })

  it('should handle edge case with empty values', () => {
    const emptyGSRecord: GSAscentRecord = {
      Climber: 'Edouard Misset',
      '# Tries': '001 Onsight',
      Crag: 'Ceuse',
      'Route / Boulder': 'Route',
      'Topo Grade': '7b+',
      Area: 'Berlin',
      'Route Name': 'Biographie',
      Date: '15/07/2023',
      Rating: '',
      'Ascent Comments': '',
      Profile: '',
      Holds: '',
      'My Grade': '',
      Height: '',
      Departement: '',
    }

    const bareBoneAscent: Omit<Ascent, 'id'> = {
      style: 'Onsight',
      tries: 1,
      climber: 'Edouard Misset',
      crag: 'Ceuse',
      climbingDiscipline: 'Route',
      topoGrade: '7b+',
      area: 'Berlin',
      routeName: 'Biographie',
      date: new Temporal.PlainDateTime(2023, 7, 15, 12, 0).toString(), // '2023-07-15T12:00:00.000Z',
    }

    customDeepEquals(transformAscentFromGSToJS(emptyGSRecord), bareBoneAscent, [
      'date',
      'id',
    ])
  })
})

describe('transformAscentFromJSToGS and transformAscentFromGSToJS', () => {
  it('should be reversible', () => {
    const ascents: Omit<Ascent, 'id'>[] = [
      {
        style: 'Redpoint',
        tries: 3,
        climber: 'Edouard Misset',
        crag: 'Balme de Yenne',
        climbingDiscipline: 'Route',
        topoGrade: '8a',
        area: 'Secteur 13',
        routeName: 'Bonobo',
        date: new Temporal.PlainDateTime(2022, 5, 10, 12, 0).toString(),
        profile: 'Overhang',
        holds: 'Pinch',
        personalGrade: '7a',
        region: 'ARA',
        height: 20,
      },
      {
        style: 'Onsight',
        tries: 1,
        climber: 'Edouard Misset',
        crag: 'Ceuse',
        climbingDiscipline: 'Route',
        topoGrade: '7b+',
        area: 'Berlin',
        routeName: 'Biographie',
        date: new Temporal.PlainDateTime(2023, 7, 15, 12, 0).toString(),
      },
      {
        style: 'Flash',
        tries: 1,
        climber: 'Edouard Misset',
        crag: 'Fontainebleau',
        climbingDiscipline: 'Boulder',
        topoGrade: '6a',
        area: 'Le Cul de Chien',
        routeName: 'La Marie Rose',
        date: new Temporal.PlainDateTime(2024, 10, 30, 12, 0).toString(),
        rating: 5,
        comments: 'Great climb!',
        profile: 'Overhang',
        holds: 'Sloper',
        personalGrade: '6a',
        region: 'Île-de-France',
      },
    ]

    // Some information loss is expected when transforming from GS to JS and back
    // like certain `hold` type are voluntarily not supported in the JS model.
    // Some information loss is expected when transforming from GS to JS and back
    // like certain `hold` type are voluntarily not supported in the JS model.

    const filteredAscents = ascents.filter(
      ascent =>
        ascent.holds === undefined ||
        setDifference([...holds], [...holdsFromGS]).includes(ascent.holds),
    )

    for (const ascent of filteredAscents) {
      customDeepEquals(
        transformAscentFromGSToJS(transformAscentFromJSToGS(ascent as Ascent)),
        ascent,
        ['date', 'id'],
      )
    }
  })
})
