import { removeAccents } from '@edouardmisset/text/remove-accents.ts'
import { levenshteinDistance } from '@std/text'

function formatString(item: string): string {
  // TODO: comment traiter toutes les différentes combinatoires Majuscules etc.
  const synonyms: Record<string, string> = {
    '(l1 + l2)': 'l1 + l2',
    'l1+l2': 'l1 + l2',
    '(p1 + p2)': 'l1 + l2',
    'p1+p2': 'l1 + l2',
    '(gauche)': 'gauche',
    '(droite)': 'droite',
    '(left)': 'gauche',
    '(right)': 'droite',
  }

  return removeAccents(item)
    .toLowerCase()
    .trim()
    .replaceAll('-', ' ')
    .replace(/[^a-z0-9\s]/gi, '') // Remove special characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .split(' ') // Split the string into words
    .map(word => synonyms[word] ?? word) // Replace synonyms
    .join(' ') // Join the words back into a string
}

export function findSimilar(items: string[]): { [key: string]: string[] }[] {
  const map = new Map<string, string[]>()

  for (const item of items) {
    const transformedItem = formatString(item)

    const existingItems = map.get(transformedItem)
    if (!existingItems) {
      map.set(transformedItem, [item])
      continue
    }
    if (!existingItems.includes(item)) {
      existingItems.push(item)
    }
  }

  return Array.from(map.entries())
    .filter(([, values]) => values.length > 1)
    .map(([key, values]) => ({ [key]: values }))
}

export function groupSimilarStrings(
  arr: string[],
  maxDistance: number,
): Map<string, string[]> {
  const result = new Map<string, string[]>()
  const seen = new Set<string>()
  const distanceCache = new Map<string, number>()

  const getDistance = (a: string, b: string): number => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    if (!distanceCache.has(key)) {
      distanceCache.set(key, levenshteinDistance(a, b))
    }
    return distanceCache.get(key) ?? 0
  }

  for (const word of arr) {
    if (!seen.has(word)) {
      const similarStrings: string[] = []
      for (const str of arr) {
        if (
          str !== word &&
          !seen.has(str) &&
          getDistance(str, word) <= maxDistance
        ) {
          similarStrings.push(str)
          seen.add(str)
        }
      }
      if (similarStrings.length > 1) {
        result.set(word, similarStrings)
      }
      seen.add(word)
    }
  }

  return result
}
