'use server'

import { getAscentById } from '~/services/ascents'

export async function getAscentComments(id: string): Promise<string | undefined> {
  return (await getAscentById(id))?.comments
}
