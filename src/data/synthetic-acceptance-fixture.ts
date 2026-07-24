const FIRST_ACCEPTANCE_YEAR = 2_023
const SECOND_ACCEPTANCE_YEAR = 2_024

export const SYNTHETIC_ASCENT_FIXTURES = [
  {
    _id: 'synthetic-ascent-1',
    area: 'North Sector',
    climbingDiscipline: 'Route',
    comments: 'Synthetic fixture with Unicode: Crème brûlée',
    crag: 'Example Crag',
    date: '2024-06-15T10:00:00.000Z',
    height: 24,
    personalGrade: '6b+',
    rating: 4,
    routeName: 'The First Move',
    style: 'Onsight',
    topoGrade: '6b',
    tries: 1,
  },
  {
    _id: 'synthetic-ascent-2',
    climbingDiscipline: 'Boulder',
    crag: 'Example Forest',
    date: '2023-10-08T10:00:00.000Z',
    holds: 'Sloper',
    profile: 'Overhang',
    routeName: 'Second Wind',
    style: 'Redpoint',
    topoGrade: '7a',
    tries: 4,
  },
] as const

export const SYNTHETIC_TRAINING_SESSION_FIXTURES = [
  {
    _id: 'synthetic-training-1',
    climbingDiscipline: 'Route',
    comments: 'Synthetic endurance session',
    date: '2024-06-14T10:00:00.000Z',
    gymCrag: 'Example Gym',
    intensity: 70,
    load: 56,
    sessionType: 'En',
    volume: 80,
  },
  {
    _id: 'synthetic-training-2',
    anatomicalRegion: 'Fi',
    date: '2023-10-07T10:00:00.000Z',
    energySystem: 'AA',
    intensity: 90,
    sessionType: 'FB',
    volume: 40,
  },
] as const

export const SYNTHETIC_ACCEPTANCE_EXPECTATIONS = {
  ascentCount: 2,
  ascentNames: ['The First Move', 'Second Wind'],
  latestAscent: {
    canonicalDate: '2024-06-15',
    canonicalDiscipline: 'Sport',
    crag: 'Example Crag',
    grade: '6b',
    id: 'synthetic-ascent-1',
    name: 'The First Move',
  },
  trainingSessionCount: 2,
  trainingSessionLocations: ['Example Gym'],
  trainingSessionTypes: ['Endurance', 'Finger Board'],
  years: [FIRST_ACCEPTANCE_YEAR, SECOND_ACCEPTANCE_YEAR],
} as const
