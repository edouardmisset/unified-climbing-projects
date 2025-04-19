import { frequency } from '@edouardmisset/array/count-by.ts'
import { removeAccents } from '@edouardmisset/text'
import { sortNumericalValues } from '~/helpers/sort-values'
import { data as ascents } from './ascent-data.json' with { type: 'json' }

// fetch data

const meaninglessWords = [
  'a',
  'assis',
  'au',
  'aux',
  'avant',
  'avec',
  'bas',
  'big',
  'blocco',
  'comme',
  'dans',
  'de',
  'des',
  'direct',
  'droite',
  'du',
  'el',
  'elle',
  'entre',
  'est',
  'et',
  'for',
  'gauche',
  'haut',
  'il',
  'integrale',
  'j',
  'l',
  'l1',
  'l1l2',
  'la',
  'le',
  'left',
  'les',
  'ligne',
  'moi',
  'n°',
  'numero',
  'pas',
  'plus',
  'pour',
  'qu',
  'que',
  'qui',
  'raccourci',
  'right',
  'sur',
  'the',
  'the',
  'trop',
  'un',
  'une',
  'voie',
] as const

const words = ascents.flatMap(({ routeName }) =>
  removeAccents(routeName)
    .toLowerCase()
    .split(/\s|\-|’|'|\(|\)|\,|\>|\<|\.|\"|\:|\?|\!|\¡|\#|\,|\=|\+|\/|\\/)
    .filter(word => word.length > 2 && !meaninglessWords.includes(word)),
)

const wordFrequency = Object.fromEntries(
  Object.entries(frequency(words)).filter(([_, value]) => value > 1),
)
const sortedWordFrequency = sortNumericalValues(wordFrequency, {
  ascending: false,
})

globalThis.console.log(`${words.length} words`)
globalThis.console.table(sortedWordFrequency)
