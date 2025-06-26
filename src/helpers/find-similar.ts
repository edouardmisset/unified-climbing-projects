import { removeAccents } from '@edouardmisset/text/remove-accents.ts'
import { levenshteinDistance } from '@std/text'

function formatString(item: string): string {
  // TODO: comment traiter toutes les différentes combinatoires Majuscules etc.
  const synonyms: Record<string, string> = {
    '(droite)': 'droite',
    '(gauche)': 'gauche',
    '(l1 + l2)': 'l1 + l2',
    '(left)': 'gauche',
    '(p1 + p2)': 'l1 + l2',
    '(right)': 'droite',
    'l1+l2': 'l1 + l2',
    'p1+p2': 'l1 + l2',
  }

  return removeAccents(item)
    .toLowerCase()
    .trim()
    .replaceAll('-', ' ')
    .replaceAll(/[^a-z0-9\s]/gi, '') // Remove special characters
    .replaceAll(/\s+/g, ' ') // Replace multiple spaces with a single space
    .split(' ') // Split the string into words
    .map(word => synonyms[word] ?? word) // Replace synonyms
    .join(' ') // Join the words back into a string
}

export function groupSimilarStrings(
  strings: string[],
  maxDistance = 2,
): Map<string, string[]> {
  const similarStringsMap = new Map<string, string[]>()
  const seen = new Set<string>()
  const distanceCache = new Map<string, number>()

  const getDistance = (a: string, b: string): number => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    if (!distanceCache.has(key)) {
      distanceCache.set(key, levenshteinDistance(a, b))
    }
    return distanceCache.get(key) ?? 0
  }

  for (const str of strings) {
    if (seen.has(str)) continue

    const similarStrings = strings.filter(
      s =>
        s !== str &&
        !seen.has(s) &&
        getDistance(str, formatString(s)) <= maxDistance,
    )

    if (similarStrings.length > 1) {
      similarStringsMap.set(str, similarStrings)
    }

    seen.add(str)
    for (const str of similarStrings) {
      seen.add(str)
    }
  }

  return similarStringsMap
}
