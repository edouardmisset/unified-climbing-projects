import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import { getAscentDetails } from '~/app/ascents/actions'
import type { Ascent } from '~/schema/ascent'
import { QueryProvider } from '../query-provider/query-provider'
import { AscentComponent } from './ascent-component'

vi.mock(import('~/app/ascents/actions'), () => ({
  getAscentDetails: vi.fn<typeof getAscentDetails>(),
}))

const ascent = {
  _id: 'ascent-id',
  comments: 'A good route',
  crag: 'Buoux',
  date: '2026-01-10',
  discipline: 'Sport',
  grade: '7a',
  name: 'La rose et le vampire',
  style: 'Redpoint',
  tries: 2,
} satisfies Ascent

describe('ascentComponent', () => {
  it('fetches ascent details only after opening the dialog', async () => {
    vi.clearAllMocks()
    vi.mocked(getAscentDetails).mockResolvedValue(ascent)
    const user = userEvent.setup()
    render(
      <QueryProvider>
        <AscentComponent ascent={ascent} />
      </QueryProvider>,
    )

    expect(getAscentDetails).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'La rose et le vampire (7a)' }))

    await expect.poll(() => getAscentDetails).toHaveBeenCalledExactlyOnceWith(ascent._id)
  })
})
