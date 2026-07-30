'use server'

import { revalidatePath } from 'next/cache'
import { addClimbingLog } from '~/services/log'
import { climbingLogFormSchema } from './schema'

export type SubmitClimbingLogResult =
  | { success: true; ascentCount: number; hasTraining: boolean }
  | { success: false; error: string }

export async function submitClimbingLog(input: unknown): Promise<SubmitClimbingLogResult> {
  const parsed = climbingLogFormSchema.safeParse(input)
  if (!parsed.success)
    return {
      error: parsed.error.issues.at(0)?.message ?? 'Invalid climbing log',
      success: false,
    }

  try {
    await addClimbingLog(parsed.data)
    revalidatePath('/', 'layout')
    return {
      ascentCount: parsed.data.ascents.length,
      hasTraining: parsed.data.training !== undefined,
      success: true,
    }
  } catch (error) {
    globalThis.console.error(
      'Error adding climbing log:',
      error instanceof Error ? error.message : error,
    )
    return {
      error: error instanceof Error ? error.message : 'Unable to save the climbing log',
      success: false,
    }
  }
}
