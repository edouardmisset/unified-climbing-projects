import { z } from 'zod'
import { type AscentImportRow, ascentDomainSchema } from './ascent'
import { type CanonicalCsvContract, parseCanonicalCsv } from './csv'

export const EIGHT_A_NU_COLUMNS = [
  'route_boulder',
  'name',
  'location_name',
  'sector_name',
  'area_name',
  'country_code',
  'date',
  'type',
  'sub_type',
  'rating',
  'project',
  'tries',
  'repeats',
  'difficulty',
  'perceived_hardness',
  'comment',
  'height',
  'recommended',
  'sits',
] as const

const raw8aNuRowSchema = z
  .object({
    area_name: z.string(),
    comment: z.string(),
    country_code: z.string(),
    date: z.string(),
    difficulty: z.string(),
    height: z.string(),
    location_name: z.string(),
    name: z.string(),
    perceived_hardness: z.string(),
    project: z.string(),
    rating: z.string(),
    recommended: z.string(),
    repeats: z.string(),
    route_boulder: z.string(),
    sector_name: z.string(),
    sits: z.string(),
    sub_type: z.string(),
    tries: z.string(),
    type: z.string(),
  })
  .strict()

const disciplineBy8aNuKind: Readonly<Partial<Record<string, 'Bouldering' | 'Sport'>>> = {
  BOULDER: 'Bouldering',
  ROUTE: 'Sport',
} as const

const styleBy8aNuType: Readonly<Partial<Record<string, 'Flash' | 'Onsight' | 'Redpoint'>>> = {
  f: 'Flash',
  os: 'Onsight',
  rp: 'Redpoint',
  // v1 does not track top-rope ascents. 8a.nu top-rope rows (`tr`) are
  // intentionally absent here so the `!style` check below rejects them
  // instead of importing them under another style.
} as const

function optionalText(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed === '' || trimmed === 'null' ? undefined : trimmed
}

function optionalInteger(value: string): number | undefined {
  const normalized = optionalText(value)
  if (normalized === undefined) return
  if (!/^\d+$/u.test(normalized)) throw new Error(`Expected an integer but received "${value}"`)
  return Number(normalized)
}

function parse8aNuRow(input: unknown): AscentImportRow {
  const row = raw8aNuRowSchema.parse(input)
  const discipline = disciplineBy8aNuKind[row.route_boulder]
  const style = styleBy8aNuType[row.type]
  if (!discipline) throw new Error(`Unsupported 8a.nu climb type "${row.route_boulder}"`)
  if (!style) throw new Error(`Unsupported 8a.nu ascent type "${row.type}"`)

  const parsedTries = optionalInteger(row.tries)
  const sector = optionalText(row.sector_name)
  const area = optionalText(row.area_name)
  const canonicalArea = area ?? (sector === 'Unknown Sector' ? undefined : sector)
  const comments = optionalText(row.comment)
  const height = optionalInteger(row.height)
  const rating = optionalInteger(row.rating)

  return ascentDomainSchema.parse({
    ...(canonicalArea === undefined ? {} : { area: canonicalArea }),
    ...(comments === undefined ? {} : { comments }),
    crag: row.location_name,
    date: row.date.slice(0, 10),
    discipline,
    grade: row.difficulty.toLowerCase(),
    ...(height === undefined ? {} : { height }),
    name: row.name,
    ...(rating === undefined ? {} : { rating }),
    style,
    // Some redpoint exports use zero for an unknown attempt count. A completed
    // ascent still has at least one attempt in the canonical contract.
    tries: Math.max(1, parsedTries ?? 1),
  })
}

const eightANuContract: CanonicalCsvContract<AscentImportRow> = {
  columns: EIGHT_A_NU_COLUMNS,
  requiredColumns: EIGHT_A_NU_COLUMNS,
  rowSchema: { parse: parse8aNuRow },
}

export function parse8aNuAscentCsv(text: string): AscentImportRow[] {
  return parseCanonicalCsv(text, eightANuContract)
}
