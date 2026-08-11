'use server'

import type { AscentRecord } from '~/domain/ascent'
import { getAscentById } from '~/services/ascents'

export async function getAscentDetails(id: string): Promise<AscentRecord | false> {
  return (await getAscentById(id)) ?? false
}
