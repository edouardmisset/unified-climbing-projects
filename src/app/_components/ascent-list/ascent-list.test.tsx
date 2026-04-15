import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Ascent } from '~/schema/ascent'
import { AscentList } from './ascent-list'

const ascent: Ascent = {
  _id: 'ascent-id',
  climbingDiscipline: 'Route',
  comments: 'A good route',
  crag: 'Buoux',
  date: '2026-01-10',
  routeName: 'La rose et le vampire',
  style: 'Redpoint',
  topoGrade: '7a',
  tries: 2,
}

describe('AscentList', () => {
  it('opens the ascent dialog on double click', async () => {
    render(<AscentList ascents={[ascent]} />)

    const row = screen.getByRole('button')
    expect(screen.queryByLabelText(/close dialog/i)).not.toBeInTheDocument()

    await userEvent.dblClick(row)

    expect(await screen.findByLabelText(/close dialog/i)).toBeInTheDocument()
  })

  it('does not open the ascent dialog on single click', async () => {
    render(<AscentList ascents={[ascent]} />)

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByLabelText(/close dialog/i)).not.toBeInTheDocument()
  })
})
