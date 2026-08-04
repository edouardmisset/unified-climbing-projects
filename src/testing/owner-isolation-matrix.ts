export const SYNTHETIC_ISOLATION_FIXTURE = {
  'user-a': {
    ascentId: 'synthetic-user-a-ascent',
    importJobId: 'synthetic-user-a-import-job',
    ownerId: 'synthetic-clerk-user-a',
    trainingSessionId: 'synthetic-user-a-training',
  },
  'user-b': {
    ascentId: 'synthetic-user-b-ascent',
    importJobId: 'synthetic-user-b-import-job',
    ownerId: 'synthetic-clerk-user-b',
    trainingSessionId: 'synthetic-user-b-training',
  },
} as const

export type IsolationActor = 'unauthenticated' | keyof typeof SYNTHETIC_ISOLATION_FIXTURE
export type IsolationOwner = keyof typeof SYNTHETIC_ISOLATION_FIXTURE

export type IsolationOperation =
  | 'create-ascent'
  | 'create-import-job'
  | 'create-training-session'
  | 'export-datasets'
  | 'find-import-duplicates'
  | 'list-ascents'
  | 'list-training-sessions'
  | 'read-aggregates'
  | 'read-ascent'
  | 'read-import-job'
  | 'read-training-session'
  | 'undo-import-job'

export type IsolationExpectation =
  | 'actor-export-only'
  | 'actor-fingerprints-only'
  | 'actor-records-only'
  | 'allow-own-job'
  | 'allow-own-record'
  | 'delete-own-job-records-only'
  | 'hide-other-owner-job'
  | 'hide-other-owner-record'
  | 'reject-unauthenticated'
  | 'stamp-actor-job'
  | 'stamp-actor-owner'

export type OwnerIsolationCase = {
  actor: IsolationActor
  expectation: IsolationExpectation
  id: string
  operation: IsolationOperation
  phase: 'owner-migration' | 'imports' | 'exports'
  targetOwner?: IsolationOwner
}

const unauthenticatedCases = [
  'list-ascents',
  'list-training-sessions',
  'read-ascent',
  'read-training-session',
  'create-ascent',
  'create-training-session',
] as const satisfies readonly IsolationOperation[]

const createActorCases = (actor: IsolationOwner, otherOwner: IsolationOwner) =>
  [
    {
      actor,
      expectation: 'actor-records-only',
      id: `${actor}-list-ascents`,
      operation: 'list-ascents',
      phase: 'owner-migration',
    },
    {
      actor,
      expectation: 'actor-records-only',
      id: `${actor}-list-training-sessions`,
      operation: 'list-training-sessions',
      phase: 'owner-migration',
    },
    {
      actor,
      expectation: 'allow-own-record',
      id: `${actor}-read-own-ascent`,
      operation: 'read-ascent',
      phase: 'owner-migration',
      targetOwner: actor,
    },
    {
      actor,
      expectation: 'hide-other-owner-record',
      id: `${actor}-read-other-ascent`,
      operation: 'read-ascent',
      phase: 'owner-migration',
      targetOwner: otherOwner,
    },
    {
      actor,
      expectation: 'allow-own-record',
      id: `${actor}-read-own-training-session`,
      operation: 'read-training-session',
      phase: 'owner-migration',
      targetOwner: actor,
    },
    {
      actor,
      expectation: 'hide-other-owner-record',
      id: `${actor}-read-other-training-session`,
      operation: 'read-training-session',
      phase: 'owner-migration',
      targetOwner: otherOwner,
    },
    {
      actor,
      expectation: 'stamp-actor-owner',
      id: `${actor}-create-ascent`,
      operation: 'create-ascent',
      phase: 'owner-migration',
    },
    {
      actor,
      expectation: 'stamp-actor-owner',
      id: `${actor}-create-training-session`,
      operation: 'create-training-session',
      phase: 'owner-migration',
    },
    {
      actor,
      expectation: 'actor-records-only',
      id: `${actor}-read-aggregates`,
      operation: 'read-aggregates',
      phase: 'owner-migration',
    },
    {
      actor,
      expectation: 'actor-fingerprints-only',
      id: `${actor}-find-import-duplicates`,
      operation: 'find-import-duplicates',
      phase: 'imports',
    },
    {
      actor,
      expectation: 'stamp-actor-job',
      id: `${actor}-create-import-job`,
      operation: 'create-import-job',
      phase: 'imports',
    },
    {
      actor,
      expectation: 'allow-own-job',
      id: `${actor}-read-own-import-job`,
      operation: 'read-import-job',
      phase: 'imports',
      targetOwner: actor,
    },
    {
      actor,
      expectation: 'hide-other-owner-job',
      id: `${actor}-read-other-import-job`,
      operation: 'read-import-job',
      phase: 'imports',
      targetOwner: otherOwner,
    },
    {
      actor,
      expectation: 'delete-own-job-records-only',
      id: `${actor}-undo-own-import-job`,
      operation: 'undo-import-job',
      phase: 'imports',
      targetOwner: actor,
    },
    {
      actor,
      expectation: 'hide-other-owner-job',
      id: `${actor}-undo-other-import-job`,
      operation: 'undo-import-job',
      phase: 'imports',
      targetOwner: otherOwner,
    },
    {
      actor,
      expectation: 'actor-export-only',
      id: `${actor}-export-datasets`,
      operation: 'export-datasets',
      phase: 'exports',
    },
  ] as const satisfies readonly OwnerIsolationCase[]

export const OWNER_ISOLATION_MATRIX = [
  ...unauthenticatedCases.map((operation): OwnerIsolationCase => {
    const isolationCase: OwnerIsolationCase = {
      actor: 'unauthenticated',
      expectation: 'reject-unauthenticated',
      id: `unauthenticated-${operation}`,
      operation,
      phase: 'owner-migration',
    }

    if (operation === 'read-ascent' || operation === 'read-training-session')
      isolationCase.targetOwner = 'user-a'

    return isolationCase
  }),
  ...createActorCases('user-a', 'user-b'),
  ...createActorCases('user-b', 'user-a'),
] as const satisfies readonly OwnerIsolationCase[]
