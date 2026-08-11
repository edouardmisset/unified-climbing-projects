'use client'

import { useState } from 'react'
import { formatGrade } from '~/helpers/format-grade'
import type { Ascent } from '~/schema/ascent'
import { AscentCardLoader } from '../ascent-card/ascent-card-loader'
import { Dialog } from '../ui/dialog/dialog'
import styles from './ascent-component.module.css'

export function AscentComponent({ ascent }: { ascent: Ascent }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { grade, discipline, name, _id } = ascent
  const formattedRouteName = `${name} (${formatGrade({ discipline, grade })})`

  return (
    <Dialog
      content={<AscentCardLoader enabled={isDialogOpen} id={_id} />}
      onOpenChange={setIsDialogOpen}
      open={isDialogOpen}
      triggerClassName={styles.trigger}
      triggerText={formattedRouteName}
    />
  )
}
