'use client'

import { useEffect, useState } from 'react'
import { getTrainingSessionComments } from '~/app/training-sessions/actions'
import { formatComments } from '~/helpers/formatters'

export function TrainingSessionComment({ id }: { id: string }) {
  const [comments, setComments] = useState<string>()

  useEffect(() => {
    let isCurrent = true

    void getTrainingSessionComments(id).then(value => {
      if (isCurrent) setComments(value)
    })

    return () => {
      isCurrent = false
    }
  }, [id])

  return comments === undefined ? undefined : <div title={comments}>{formatComments(comments)}</div>
}
