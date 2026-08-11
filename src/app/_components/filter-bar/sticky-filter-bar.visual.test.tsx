import { describe, expect, it, vi } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { StickyFilterBar } from './sticky-filter-bar'

const VISUAL_STYLE = { minHeight: 844, width: 390 }

describe('sticky filter bar visual regression', () => {
  it('matches the mobile filter controls and open sheet baselines', async () => {
    const screen = await render(
      <div data-testid='visual' style={VISUAL_STYLE}>
        <StickyFilterBar
          filters={[
            {
              name: 'Year',
              options: ['2025', '2026'],
              selectedValue: '2026',
              setValue: vi.fn<(value: string) => void>(),
              title: 'Year',
            },
            {
              name: 'Style',
              options: ['Onsight', 'Redpoint'],
              selectedValue: 'all',
              setValue: vi.fn<(value: string) => void>(),
              title: 'Ascent Style',
            },
          ]}
          showSearch={false}
        />
      </div>,
    )

    const filterTrigger = screen.getByLabelText('Open filters')
    await expect.element(filterTrigger).toMatchScreenshot('mobile-closed.png')
    await filterTrigger.click()
    await expect.element(screen.getByRole('dialog')).toMatchScreenshot('mobile-open.png')
  })
})
