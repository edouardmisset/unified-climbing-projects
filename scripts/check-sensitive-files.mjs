// oxlint-disable import/no-nodejs-modules
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const forbiddenPatterns = [
  /^src\/backup\//u,
  /^exports\//u,
  /(?:^|\/)(?:backup|export|snapshot)[^/]*\.(?:json|jsonl|csv|zip)$/iu,
  /\.(?:zip|tar|tgz|gz)$/iu,
]

const trackedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
const violations = trackedFiles.filter(
  (file) => existsSync(file) && forbiddenPatterns.some((pattern) => pattern.test(file)),
)

if (violations.length > 0) {
  console.error('Sensitive backup/export files are tracked:')
  for (const violation of violations) console.error(`- ${violation}`)
  process.exitCode = 1
}
