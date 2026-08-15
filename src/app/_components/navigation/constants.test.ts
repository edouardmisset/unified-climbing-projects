import { describe, expect, it } from 'vite-plus/test'
import { getNavigationItems } from './constants'

function getNavigationHrefs(context: 'ascents' | 'training') {
  return getNavigationItems(context).flatMap((item): string[] => {
    if (item.type === 'link') return [item.href]
    if (item.type === 'group') return item.links.map(link => link.href)
    return []
  })
}

describe('navigation items', () => {
  it('links to Settings without exposing standalone import routes', () => {
    const hrefs = [...getNavigationHrefs('ascents'), ...getNavigationHrefs('training')]

    expect(hrefs).toContain('/settings')
    expect(hrefs).toContain('/log')
    expect(hrefs).not.toContain('/ascent-form')
    expect(hrefs).not.toContain('/training-session-form')
    expect(hrefs).not.toContain('/import')
  })

  it('exposes calendar and visual routes per selected context', () => {
    const ascentsHrefs = getNavigationHrefs('ascents')
    const trainingHrefs = getNavigationHrefs('training')

    expect(ascentsHrefs).toContain('/ascents/calendar')
    expect(ascentsHrefs).toContain('/ascents/barcode')
    expect(ascentsHrefs).toContain('/ascents/qr-code')
    expect(ascentsHrefs).not.toContain('/training-sessions/calendar')

    expect(trainingHrefs).toContain('/training-sessions/calendar')
    expect(trainingHrefs).toContain('/training-sessions/barcode')
    expect(trainingHrefs).toContain('/training-sessions/qr-code')
    expect(trainingHrefs).not.toContain('/ascents/calendar')
  })
})
