import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vite-plus/test'
import type { SignedIn, SignedOut } from '@clerk/nextjs'
import { PublicPageShell } from './public-page-shell'

vi.mock(import('@clerk/nextjs'), () => ({
  SignedIn: (({ children }: { children: ReactNode }) => children) as typeof SignedIn,
  SignedOut: (({ children }: { children: ReactNode }) => children) as typeof SignedOut,
}))

describe('publicPageShell', () => {
  it('provides shared branding, navigation, content, and legal links', () => {
    render(
      <PublicPageShell layout='prose'>
        <h1>Public content</h1>
      </PublicPageShell>,
    )

    expect(screen.getByRole('link', { name: 'Climbing Log Beta' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('navigation', { name: 'Public navigation' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Public content' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Legal navigation' })).toBeInTheDocument()
  })
})
