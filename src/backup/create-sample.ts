import { writeFile } from 'node:fs/promises'
import ascents from './ascent-data.json' with { type: 'json' }

const SAMPLE_SIZE = 100
const STRATIFY_BY: (keyof (typeof ascents)[number])[] = [
  'crag',
  'climbingDiscipline',
  'style',
  'tries',
]

// Function to get a random sample of specified size from an array
// biome-ignore lint/suspicious/noExplicitAny: experimental move fast and break things
function getRandomSample(arr: any[], size: number): any[] {
  const shuffled = arr.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, size)
}

// Function to perform stratified sampling by multiple keys
function stratifiedSample(
  // biome-ignore lint/suspicious/noExplicitAny: experimental move fast and break things
  data: any[],
  size: number,
  stratificationKeys: string[],
  // biome-ignore lint/suspicious/noExplicitAny: experimental move fast and break things
): any[] {
  const strata = data.reduce(
    (acc, entry) => {
      const key = stratificationKeys.map(factor => entry[factor]).join('|')
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(entry)
      return acc
    },
    // biome-ignore lint/suspicious/noExplicitAny: experimental move fast and break things
    {} as { [key: string]: any[] },
  )

  // biome-ignore lint/suspicious/noExplicitAny: experimental move fast and break things
  const sample: any[] = []
  const strataKeys = Object.keys(strata)
  const samplesPerStratum = Math.floor(size / strataKeys.length)

  for (const key of strataKeys) {
    const stratumSample = getRandomSample(strata[key], samplesPerStratum)
    sample.push(...stratumSample)
  }

  // If there are remaining samples to be taken, randomly select from all strata
  const remainingSamples = size - sample.length
  if (remainingSamples > 0) {
    const allEntries = Object.values(strata).flat()
    const additionalSamples = getRandomSample(allEntries, remainingSamples)
    sample.push(...additionalSamples)
  }

  return sample
}

// Select n random ascents from the data using stratified sampling by multiple keys
const subset = stratifiedSample(ascents, SAMPLE_SIZE, STRATIFY_BY)

// Write the subset to a new JSON file
await writeFile(
  `./src/server/backup/ascent-data-sample-${new Date().toISOString().slice(0, 10)}.json`,
  JSON.stringify(subset, null, 2),
)

globalThis.console.log(
  `Sampled ${subset.length} entries from the original data.`,
)
