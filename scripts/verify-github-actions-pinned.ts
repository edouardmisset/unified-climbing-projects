/* eslint-disable import/no-nodejs-modules, no-console */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const repositoryRoot = path.resolve(import.meta.dirname, '..')
const workflowDirectory = path.join(repositoryRoot, '.github', 'workflows')

function collectFiles(directory: string): string[] {
  if (!existsSync(directory)) return []

  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectFiles(entryPath)
    return entry.name.endsWith('.yml') || entry.name.endsWith('.yaml') ? [entryPath] : []
  })
}

const files = [
  ...collectFiles(workflowDirectory),
  ...['action.yml', 'action.yaml']
    .map(file => path.join(repositoryRoot, file))
    .filter(file => existsSync(file)),
]

const findings: string[] = []

export function normalizeReference(reference: string): string | undefined {
  const [firstCharacter] = reference
  const lastCharacter = reference.at(-1)
  const isQuoted = firstCharacter === "'" || firstCharacter === '"'

  if (!isQuoted) return lastCharacter === "'" || lastCharacter === '"' ? undefined : reference
  if (lastCharacter !== firstCharacter) return undefined

  return reference.slice(1, -1)
}

for (const file of files) {
  const source = readFileSync(file, 'utf8')
  const usesPattern = /^\s*(?:-\s*)?uses:\s*(?<reference>[^\s#]+)(?:\s+#.*)?$/gmu

  for (const match of source.matchAll(usesPattern)) {
    const { reference: capturedReference } = match.groups ?? {}
    if (typeof capturedReference !== 'string' || capturedReference.length === 0) continue
    const reference = normalizeReference(capturedReference)
    if (reference === undefined || reference.length === 0) continue
    if (reference.startsWith('./') || reference.startsWith('../')) continue
    if (/@[0-9a-f]{40}$/iu.test(reference)) continue

    const line = source.slice(0, match.index).split('\n').length
    findings.push(`${path.relative(repositoryRoot, file)}:${line} uses ${reference}`)
  }
}

if (findings.length > 0) {
  console.error('Every external GitHub Action must be pinned to a 40-character commit SHA:')
  for (const finding of findings) console.error(`- ${finding}`)
  process.exitCode = 1
} else
  console.log(
    `Verified ${files.length} workflow/action file(s): all external actions are SHA-pinned.`,
  )
