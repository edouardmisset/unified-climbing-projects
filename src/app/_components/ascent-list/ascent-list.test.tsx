import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import { getAscentDetails } from '~/app/ascents/actions'
import { QueryProvider } from '../query-provider/query-provider'
import type { Ascent } from '~/schema/ascent'
import { AscentList } from './ascent-list'

vi.mock(import('~/app/ascents/actions'), () => ({
  getAscentDetails: vi.fn<typeof getAscentDetails>(),
}))

const ascent: Ascent = {
  _id: 'ascent-id',
  discipline: 'Sport',
  comments: 'A good route',
  crag: 'Buoux',
  date: '2026-01-10',
  name: 'La rose et le vampire',
  style: 'Redpoint',
  grade: '7a',
  tries: 2,
}

describe('ascentList', () => {
  it('opens the ascent dialog on double click', async () => {
    vi.clearAllMocks()
    vi.mocked(getAscentDetails).mockResolvedValue(ascent)
    render(
      <QueryProvider>
        <AscentList ascents={[ascent]} />
      </QueryProvider>,
    )

    const row = screen.getByRole('button')
    expect(screen.queryByLabelText(/close dialog/iu)).not.toBeInTheDocument()
    expect(getAscentDetails).not.toHaveBeenCalled()

    await userEvent.dblClick(row)

    await expect(screen.findByLabelText(/close dialog/iu)).resolves.toBeInTheDocument()
    await expect.poll(() => getAscentDetails).toHaveBeenCalledExactlyOnceWith(ascent._id)
  })

  it('does not open the ascent dialog on single click', async () => {
    vi.clearAllMocks()
    vi.mocked(getAscentDetails).mockResolvedValue(ascent)
    render(
      <QueryProvider>
        <AscentList ascents={[ascent]} />
      </QueryProvider>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByLabelText(/close dialog/iu)).not.toBeInTheDocument()
    expect(getAscentDetails).not.toHaveBeenCalled()
  })
})
