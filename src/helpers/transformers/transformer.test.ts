import { assert, describe, it } from 'poku'
import {
  transformAscentFromGSToJS,
  transformAscentFromJSToGS,
} from '~/helpers/transformers/transformers'
import { type Ascent, HOLDS, HOLDS_FROM_GS } from '~/schema/ascent'
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
    const boulderingAscent: Omit<Ascent, '_id'> = {
      area: 'Le Cul de Chien',
      climber: 'Edouard Misset',
      climbingDiscipline: 'Boulder',
      comments: 'Great climb!',
      crag: 'Fontainebleau',
      date: new Date(2024, 9, 30, 12, 0).toString(),
      holds: 'Sloper',
      personalGrade: '6a',
      profile: 'Overhang', // 2024-10-30T12:00:00.000Z
      rating: 5,
      region: 'Île-de-France',
      routeName: 'La Marie Rose',
      style: 'Flash',
      topoGrade: '6a',
      tries: 1,
    }

    const expectedGSRecord = {
      '# Tries': '01 Flash',
      Area: 'Le Cul de Chien',
      Comments: 'Great climb!',
      'Ascent Comments': 'Great climb!',
      Climber: 'Edouard Misset',
      Crag: 'Fontainebleau',
      Date: '30/10/2024',
      Departement: 'Île-de-France',
      Height: '',
      Holds: 'Sloper',
      'My Grade': '6a',
      Profile: 'Overhang',
      Rating: '5*',
      'Route / Boulder': 'Boulder',
      'Route Name': 'La Marie Rose',
      'Topo Grade': '6a',
    } satisfies GSAscentRecord

    customDeepEquals(
      transformAscentFromJSToGS(boulderingAscent as Ascent),
      expectedGSRecord,
      ['Date'],
    )
  })
  it('should transform route ascents', () => {
    const routeAscent: Omit<Ascent, '_id'> = {
      area: 'Secteur 13',
      climber: 'Edouard Misset',
      climbingDiscipline: 'Route',
      crag: 'Balme de Yenne',
      date: new Date(2022, 4, 10, 12, 0).toString(),
      height: 20,
      holds: 'Pinch',
      personalGrade: '7a',
      profile: 'Overhang', // 2022-05-10T12:00:00.000Z
      region: 'ARA',
      routeName: 'Bonobo',
      style: 'Redpoint',
      topoGrade: '8a',
      tries: 3,
    }

    const expectedGSRecord = {
      '# Tries': '03 go',
      Area: 'Secteur 13',
      Comments: '',
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
    const undefinedAscent: Omit<Ascent, '_id'> = {
      area: 'Berlin',
      climber: 'Edouard Misset',
      climbingDiscipline: 'Route',
      comments: undefined,
      crag: 'Ceuse',
      date: new Date(2023, 6, 15, 8, 0).toString(),
      height: undefined,
      holds: undefined,
      personalGrade: undefined, // 2023-07-15T08:00:00.000Z
      profile: undefined,
      rating: undefined,
      region: undefined,
      routeName: 'Biographie',
      style: 'Onsight',
      topoGrade: '7b+',
      tries: 1,
    }

    const expectedGSRecord = {
      '# Tries': '001 Onsight',
      Area: 'Berlin',
      Comments: '',
      'Ascent Comments': '',
      Climber: 'Edouard Misset',
      Crag: 'Ceuse',
      Date: '15/07/2023',
      Departement: '',
      Height: '',
      Holds: '',
      'My Grade': '',
      Profile: '',
      Rating: '',
      'Route / Boulder': 'Route',
      'Route Name': 'Biographie',
      'Topo Grade': '7b+',
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
      '# Tries': '01 Flash',
      Area: 'Le Cul de Chien',
      Comments: 'Great climb!',
      'Ascent Comments': 'Great climb!',
      Climber: 'Edouard Misset',
      Crag: 'Fontainebleau',
      Date: '30/10/2024',
      Departement: 'Île-de-France',
      Height: '',
      Holds: 'Sloper',
      'My Grade': '6a',
      Profile: 'Overhang',
      Rating: '5*',
      'Route / Boulder': 'Boulder',
      'Route Name': 'La Marie Rose',
      'Topo Grade': '6a',
    }

    const expectedAscent: Omit<Ascent, '_id'> = {
      area: 'Le Cul de Chien',
      climber: 'Edouard Misset',
      climbingDiscipline: 'Boulder',
      comments: 'Great climb!',
      crag: 'Fontainebleau',
      date: new Date(2024, 9, 30, 12, 0).toString(),
      holds: 'Sloper',
      personalGrade: '6a',
      profile: 'Overhang', // '2024-10-30T12:00:00.000Z',
      rating: 5,
      region: 'Île-de-France',
      routeName: 'La Marie Rose',
      style: 'Flash',
      topoGrade: '6a',
      tries: 1,
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
      Comments: '',
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

    const expectedAscent: Omit<Ascent, '_id'> = {
      area: 'Secteur 13',
      climber: 'Edouard Misset',
      climbingDiscipline: 'Route',
      crag: 'Balme de Yenne',
      date: new Date(2022, 4, 10, 12, 0).toString(),
      height: 20,
      holds: 'Pinch',
      personalGrade: '7a',
      profile: 'Overhang', // 2022-05-10T12:00:00.000Z
      region: 'ARA',
      routeName: 'Bonobo',
      style: 'Redpoint',
      topoGrade: '8a',
      tries: 3,
    }

    const { _id, ...actualAscent } = transformAscentFromGSToJS(routeGSRecord)

    customDeepEquals(actualAscent, expectedAscent, ['date'])
  })

  it('should handle edge case with empty values', () => {
    const emptyGSRecord: GSAscentRecord = {
      '# Tries': '001 Onsight',
      Area: 'Berlin',
      Comments: '',
      'Ascent Comments': '',
      Climber: 'Edouard Misset',
      Crag: 'Ceuse',
      Date: '15/07/2023',
      Departement: '',
      Height: '',
      Holds: '',
      'My Grade': '',
      Profile: '',
      Rating: '',
      'Route / Boulder': 'Route',
      'Route Name': 'Biographie',
      'Topo Grade': '7b+',
    }

    const bareBoneAscent: Omit<Ascent, '_id'> = {
      area: 'Berlin',
      climber: 'Edouard Misset',
      climbingDiscipline: 'Route',
      crag: 'Ceuse',
      date: new Date(2023, 6, 15, 12, 0).toString(),
      routeName: 'Biographie',
      style: 'Onsight',
      topoGrade: '7b+',
      tries: 1, // '2023-07-15T12:00:00.000Z',
    }

    customDeepEquals(transformAscentFromGSToJS(emptyGSRecord), bareBoneAscent, [
      'date',
    ])
  })
})

describe('transformAscentFromJSToGS and transformAscentFromGSToJS', () => {
  it('should be reversible', () => {
    const ascents: Omit<Ascent, '_id'>[] = [
      {
        area: 'Secteur 13',
        climber: 'Edouard Misset',
        climbingDiscipline: 'Route',
        crag: 'Balme de Yenne',
        date: new Date(2022, 4, 10, 12, 0).toString(),
        height: 20,
        holds: 'Pinch',
        personalGrade: '7a',
        profile: 'Overhang',
        region: 'ARA',
        routeName: 'Bonobo',
        style: 'Redpoint',
        topoGrade: '8a',
        tries: 3,
      },
      {
        area: 'Berlin',
        climber: 'Edouard Misset',
        climbingDiscipline: 'Route',
        crag: 'Ceuse',
        date: new Date(2023, 6, 15, 12, 0).toString(),
        routeName: 'Biographie',
        style: 'Onsight',
        topoGrade: '7b+',
        tries: 1,
      },
      {
        area: 'Le Cul de Chien',
        climber: 'Edouard Misset',
        climbingDiscipline: 'Boulder',
        comments: 'Great climb!',
        crag: 'Fontainebleau',
        date: new Date(2024, 9, 30, 12, 0).toString(),
        holds: 'Sloper',
        personalGrade: '6a',
        profile: 'Overhang',
        rating: 5,
        region: 'Île-de-France',
        routeName: 'La Marie Rose',
        style: 'Flash',
        topoGrade: '6a',
        tries: 1,
      },
    ]

    // Some information loss is expected when transforming from GS to JS and back
    // like certain `hold` type are voluntarily not supported in the JS model.
    // Some information loss is expected when transforming from GS to JS and back
    // like certain `hold` type are voluntarily not supported in the JS model.

    const holdsUniqueToGS = new Set(HOLDS_FROM_GS).difference(new Set(HOLDS))

    const filteredAscents = ascents.filter(
      ({ holds }) => holds !== undefined && !holdsUniqueToGS.has(holds),
    )

    for (const ascent of filteredAscents) {
      customDeepEquals(
        transformAscentFromGSToJS(transformAscentFromJSToGS(ascent as Ascent)),
        ascent,
        ['date'],
      )
    }
  })
})
