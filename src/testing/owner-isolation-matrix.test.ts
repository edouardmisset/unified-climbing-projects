import { describe, expect, it } from 'vitest'
import {
  OWNER_ISOLATION_MATRIX,
  SYNTHETIC_ISOLATION_FIXTURE,
  type OwnerIsolationCase,
} from './owner-isolation-matrix'

const authenticatedCases = OWNER_ISOLATION_MATRIX.filter(({ actor }) => actor !== 'unauthenticated')

function relationshipToTarget(testCase: OwnerIsolationCase): 'none' | 'other' | 'own' {
  if (testCase.targetOwner === undefined || testCase.actor === 'unauthenticated') return 'none'
  return testCase.targetOwner === testCase.actor ? 'own' : 'other'
}

function symmetricSignature(testCase: OwnerIsolationCase): string {
  return [
    testCase.expectation,
    testCase.operation,
    testCase.phase,
    relationshipToTarget(testCase),
  ].join(':')
}

describe('owner isolation acceptance matrix', () => {
  it('uses distinct synthetic identities and record identifiers', () => {
    const fixtureValues = Object.values(SYNTHETIC_ISOLATION_FIXTURE)
    const identifiers = fixtureValues.flatMap(fixtureValue => Object.values(fixtureValue))

    expect(new Set(identifiers).size).toBe(identifiers.length)
    expect(identifiers.every(identifier => identifier.startsWith('synthetic-'))).toBe(true)
  })

  it('has unique case identifiers', () => {
    const caseIds = OWNER_ISOLATION_MATRIX.map(({ id }) => id)
    expect(new Set(caseIds).size).toBe(caseIds.length)
  })

  it('covers unauthenticated list, detail, and create access', () => {
    const unauthenticatedOperations = OWNER_ISOLATION_MATRIX.filter(
      ({ actor }) => actor === 'unauthenticated',
    ).map(({ expectation, operation }) => ({ expectation, operation }))

    expect(unauthenticatedOperations).toStrictEqual([
      { expectation: 'reject-unauthenticated', operation: 'list-ascents' },
      { expectation: 'reject-unauthenticated', operation: 'list-training-sessions' },
      { expectation: 'reject-unauthenticated', operation: 'read-ascent' },
      { expectation: 'reject-unauthenticated', operation: 'read-training-session' },
      { expectation: 'reject-unauthenticated', operation: 'create-ascent' },
      { expectation: 'reject-unauthenticated', operation: 'create-training-session' },
    ])
  })

  it('keeps user A and user B coverage symmetrical', () => {
    const userACases = authenticatedCases
      .filter(({ actor }) => actor === 'user-a')
      .map(testCase => symmetricSignature(testCase))
      .toSorted()
    const userBCases = authenticatedCases
      .filter(({ actor }) => actor === 'user-b')
      .map(testCase => symmetricSignature(testCase))
      .toSorted()

    expect(userACases).toStrictEqual(userBCases)
  })

  it('covers owner-scoped reads, writes, aggregates, imports, undo, and exports', () => {
    const operations = new Set(OWNER_ISOLATION_MATRIX.map(({ operation }) => operation))

    expect(operations).toStrictEqual(
      new Set([
        'create-ascent',
        'create-import-job',
        'create-training-session',
        'export-datasets',
        'find-import-duplicates',
        'list-ascents',
        'list-training-sessions',
        'read-aggregates',
        'read-ascent',
        'read-import-job',
        'read-training-session',
        'undo-import-job',
      ]),
    )
  })

  it('expects cross-owner record and job access to be hidden', () => {
    const crossOwnerCases = authenticatedCases.filter(
      testCase => relationshipToTarget(testCase) === 'other',
    )

    expect(crossOwnerCases).not.toHaveLength(0)
    expect(
      crossOwnerCases.every(({ expectation }) => expectation.startsWith('hide-other-owner-')),
    ).toBe(true)
  })
})
