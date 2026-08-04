import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vite-plus/test'

const SOURCE_ROOT = join(process.cwd(), 'src')
const logWizardPath = join(SOURCE_ROOT, 'app/log/_components/log-wizard.tsx')

const getSourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = join(directory, entry.name)
    if (entry.isDirectory()) return getSourceFiles(fullPath)
    if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) return [fullPath]
    return []
  })

describe('react compiler memoization', () => {
  it('should not use manual memoization APIs in source files', () => {
    const blockedPatterns = [/\bmemo\s*\(/u, /\buseMemo\b/u, /\buseCallback\b/u]
    const files = getSourceFiles(SOURCE_ROOT).filter(
      file => !file.endsWith('.test.tsx') && !file.endsWith('.test.ts'),
    )
    const offenders: string[] = []

    for (const file of files) {
      const fileContent = readFileSync(file, 'utf8')
      if (blockedPatterns.some(pattern => pattern.test(fileContent))) offenders.push(file)
    }

    expect(offenders).toStrictEqual([])
  })

  it('should keep form component excluded from memoization', () => {
    const logWizardSource = readFileSync(logWizardPath, 'utf8')
    expect(logWizardSource).toContain("'use no memo'")
  })
})
