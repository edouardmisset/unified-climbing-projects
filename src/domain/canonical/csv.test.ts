import { describe, expect, it } from 'vitest'
import {
  CanonicalCsvError,
  type CanonicalCsvErrorCode,
  decodeUtf8Csv,
  parseCanonicalCsv,
  serializeCanonicalCsv,
} from './csv'

type ExampleRow = {
  empty?: string
  name: string
  note?: string
}

const exampleContract = {
  columns: ['name', 'note', 'empty'],
  requiredColumns: ['name'],
  rowSchema: {
    parse(input: unknown): ExampleRow {
      const row = input as Record<string, string>
      if (!row.name) throw new Error('name is required')
      return row as ExampleRow
    },
  },
} as const

function captureCsvError(callback: () => unknown): CanonicalCsvError {
  let caughtError: unknown = undefined

  try {
    callback()
  } catch (error) {
    caughtError = error
  }

  if (!(caughtError instanceof CanonicalCsvError))
    throw new Error('Expected a CanonicalCsvError', { cause: caughtError })

  return caughtError
}

describe('parseCanonicalCsv', () => {
  it('parses commas, escaped quotes, multiline text, Unicode, and empty quoted cells', () => {
    const csv =
      'name,note,empty\r\n"Crag, ""North""","line one\nline two",""\r\n"Été","Arête",""\r\n'

    expect(parseCanonicalCsv(csv, exampleContract)).toStrictEqual([
      {
        empty: '',
        name: 'Crag, "North"',
        note: 'line one\nline two',
      },
      { empty: '', name: 'Été', note: 'Arête' },
    ])
  })

  it('accepts a UTF-8 byte-order mark and a final row without a newline', () => {
    expect(parseCanonicalCsv('\uFEFFnote,name\nvalue,Example', exampleContract)).toStrictEqual([
      { name: 'Example', note: 'value' },
    ])
  })

  it.each([
    ['', 'EMPTY_FILE'],
    ['name,name\nA,B', 'DUPLICATE_HEADER'],
    ['name,unknown\nA,B', 'UNKNOWN_HEADER'],
    ['note\nA', 'MISSING_REQUIRED_HEADER'],
    ['name,\nA,B', 'BLANK_HEADER'],
    ['name,note\nA', 'COLUMN_COUNT_MISMATCH'],
    ['name,note\nA,"unterminated', 'UNTERMINATED_QUOTED_FIELD'],
    ['name,note\nA,b"c', 'UNEXPECTED_QUOTE'],
    ['name,note\nA,"B"oops', 'UNEXPECTED_QUOTE'],
  ] as const)('rejects invalid CSV with %s', (csv, expectedCode) => {
    const error = captureCsvError(() => parseCanonicalCsv(csv, exampleContract))
    expect(error.code).toBe(expectedCode satisfies CanonicalCsvErrorCode)
  })

  it('reports the physical starting line for an invalid multiline row', () => {
    const error = captureCsvError(() =>
      parseCanonicalCsv('name,note\n"line one\nline two",""\n,"valid"\n', exampleContract),
    )

    expect(error).toMatchObject({ code: 'INVALID_ROW', row: 4 })
  })
})

describe('serializeCanonicalCsv', () => {
  it('uses fixed columns and deterministic RFC-style escaping', () => {
    const csv = serializeCanonicalCsv(
      [
        {
          ascii: 'plain',
          comma: 'a,b',
          empty: '',
          newline: 'line one\nline two',
          quote: 'say "hi"',
          unicode: 'Été',
        },
      ],
      ['ascii', 'empty', 'comma', 'quote', 'newline', 'unicode'],
    )

    expect(csv).toBe(
      'ascii,empty,comma,quote,newline,unicode\r\nplain,"","a,b","say ""hi""","line one\nline two","Été"\r\n',
    )
  })

  it('rejects non-string export cells', () => {
    const error = captureCsvError(() => serializeCanonicalCsv([{ count: 1 }], ['count']))
    expect(error).toMatchObject({ code: 'INVALID_EXPORT_ROW', column: 1, row: 2 })
  })

  it.each([['=1+1'], ['+1'], ['-1'], ['@SUM(A1)'], ['\t=1'], ['\r=1']])(
    'neutralizes spreadsheet formulas by quoting and prefixing %s with a single quote',
    value => {
      expect(serializeCanonicalCsv([{ value }], ['value'])).toBe(`value\r\n"'${value}"\r\n`)
    },
  )

  it('does not alter values that merely contain, but do not start with, formula-trigger characters', () => {
    expect(serializeCanonicalCsv([{ value: 'a=b+c' }], ['value'])).toBe('value\r\na=b+c\r\n')
  })
})

describe('decodeUtf8Csv', () => {
  it('decodes valid UTF-8 bytes in browser-compatible code', () => {
    const bytes = new TextEncoder().encode('name\n"Été"\n')
    expect(decodeUtf8Csv(bytes)).toBe('name\n"Été"\n')
  })

  it('rejects invalid UTF-8 bytes', () => {
    const error = captureCsvError(() => decodeUtf8Csv(new Uint8Array([195, 40])))
    expect(error.code).toBe('INVALID_UTF8')
  })
})
