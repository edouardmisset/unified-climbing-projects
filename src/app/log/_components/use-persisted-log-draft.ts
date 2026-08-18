'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'
import type { UseFormReset, UseFormSubscribe } from 'react-hook-form'
import { LOG_DRAFT_VERSION, type LogDraft, logDraftSchema, persistedLogDraftSchema } from '../draft'

const DRAFT_STORAGE_PREFIX = 'climbing-log-draft'
const DRAFT_SAVE_DELAY_MS = 300
const DRAFT_TTL_DAYS = 7
const DRAFT_TTL_MS = DRAFT_TTL_DAYS * 24 * 60 * 60 * 1_000

type UsePersistedLogDraftOptions = {
  initialDraft: LogDraft
  reset: UseFormReset<LogDraft>
  subscribe: UseFormSubscribe<LogDraft>
}

function removeStoredDraft(storageKey: string): void {
  try {
    globalThis.localStorage.removeItem(storageKey)
  } catch {
    // Browser privacy settings may make Web Storage unavailable.
  }
}

function saveStoredDraft(storageKey: string, values: LogDraft): void {
  try {
    globalThis.localStorage.setItem(
      storageKey,
      JSON.stringify({
        savedAt: Date.now(),
        values,
        version: LOG_DRAFT_VERSION,
      }),
    )
  } catch {
    // A draft should never prevent the form itself from working.
  }
}

export function usePersistedLogDraft({
  initialDraft,
  reset,
  subscribe,
}: UsePersistedLogDraftOptions): { resetDraft: () => void } {
  const { isLoaded, user } = useUser()
  // oxlint-disable-next-line unicorn/no-useless-undefined -- React 19 requires an initial ref value.
  const saveTimeout = useRef<ReturnType<typeof globalThis.setTimeout>>(undefined)
  // oxlint-disable-next-line unicorn/no-useless-undefined -- React 19 requires an initial ref value.
  const pendingDraft = useRef<LogDraft>(undefined)
  const initialDraftJson = JSON.stringify(initialDraft)
  const storageKey =
    isLoaded && user ? `${DRAFT_STORAGE_PREFIX}:v${LOG_DRAFT_VERSION}:${user.id}` : undefined

  useEffect(() => {
    if (storageKey === undefined) return

    try {
      const storedValue = globalThis.localStorage.getItem(storageKey)
      if (typeof storedValue === 'string') {
        const parsedDraft = persistedLogDraftSchema.safeParse(JSON.parse(storedValue))
        const isExpired =
          parsedDraft.success && Date.now() - parsedDraft.data.savedAt > DRAFT_TTL_MS

        if (parsedDraft.success && !isExpired)
          reset(parsedDraft.data.values, { keepDefaultValues: true })
        else removeStoredDraft(storageKey)
      }
    } catch {
      removeStoredDraft(storageKey)
    }

    const unsubscribe = subscribe({
      callback: ({ values }) => {
        const parsedValues = logDraftSchema.safeParse(values)
        if (!parsedValues.success) return

        if (saveTimeout.current !== undefined) globalThis.clearTimeout(saveTimeout.current)
        pendingDraft.current = undefined

        if (JSON.stringify(parsedValues.data) === initialDraftJson) {
          removeStoredDraft(storageKey)
          return
        }

        pendingDraft.current = parsedValues.data
        saveTimeout.current = globalThis.setTimeout(() => {
          saveStoredDraft(storageKey, parsedValues.data)
          pendingDraft.current = undefined
        }, DRAFT_SAVE_DELAY_MS)
      },
      formState: { values: true },
    })

    return () => {
      unsubscribe()
      if (saveTimeout.current !== undefined) globalThis.clearTimeout(saveTimeout.current)
      if (pendingDraft.current !== undefined) saveStoredDraft(storageKey, pendingDraft.current)
      pendingDraft.current = undefined
    }
  }, [initialDraftJson, reset, storageKey, subscribe])

  const resetDraft = () => {
    if (saveTimeout.current !== undefined) globalThis.clearTimeout(saveTimeout.current)
    pendingDraft.current = undefined
    if (storageKey !== undefined) removeStoredDraft(storageKey)
    reset(initialDraft)
  }

  return { resetDraft }
}
