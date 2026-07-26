export type CanonicalCsvErrorCode =
  | 'BLANK_HEADER'
  | 'COLUMN_COUNT_MISMATCH'
  | 'DUPLICATE_HEADER'
  | 'EMPTY_FILE'
  | 'INVALID_CONTRACT'
  | 'INVALID_EXPORT_ROW'
  | 'INVALID_ROW'
  | 'INVALID_UTF8'
  | 'MISSING_REQUIRED_HEADER'
  | 'UNEXPECTED_QUOTE'
  | 'UNKNOWN_HEADER'
  | 'UNTERMINATED_QUOTED_FIELD'

type CanonicalCsvErrorOptions = {
  cause?: unknown
  column?: number
  row?: number
}

export class CanonicalCsvError extends Error {
  readonly code: CanonicalCsvErrorCode
  readonly column: number | undefined
  readonly row: number | undefined

  constructor(code: CanonicalCsvErrorCode, message: string, options?: CanonicalCsvErrorOptions) {
    super(message, { cause: options?.cause })
    this.name = 'CanonicalCsvError'
    this.code = code
    this.column = options?.column
    this.row = options?.row
  }
}

type CsvRowSchema<T> = {
  parse: (input: unknown) => T
}

export type CanonicalCsvContract<T> = {
  columns: readonly string[]
  requiredColumns: readonly string[]
  rowSchema: CsvRowSchema<T>
}

type ParsedCsvRecord = {
  cells: string[]
  line: number
}

const BYTE_ORDER_MARK = '\uFEFF'
const CSV_RECORD_SEPARATOR = '\r\n'

// A CSV tokenizer is an explicit state machine; splitting the branches obscures its transitions.
// oxlint-disable-next-line complexity
function parseCsvRecords(input: string): ParsedCsvRecord[] {
  const text = input.startsWith(BYTE_ORDER_MARK) ? input.slice(1) : input
  if (text.length === 0) throw new CanonicalCsvError('EMPTY_FILE', 'CSV file is empty')

  const records: ParsedCsvRecord[] = []
  let row: string[] = []
  let field = ''
  let line = 1
  let rowStartLine = 1
  let inQuotedField = false
  let afterQuotedField = false
  let fieldWasQuoted = false
  let recordStarted = false

  const pushField = () => {
    row.push(field)
    field = ''
    afterQuotedField = false
    fieldWasQuoted = false
  }

  const pushRow = () => {
    records.push({ cells: row, line: rowStartLine })
    row = []
    recordStarted = false
    rowStartLine = line + 1
  }

  for (let index = 0; index < text.length; index++) {
    const character = text[index]

    if (inQuotedField) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"'
          index++
          continue
        }

        inQuotedField = false
        afterQuotedField = true
        continue
      }

      field += character
      if (character === '\r') {
        if (text[index + 1] === '\n') {
          field += '\n'
          index++
        }
        line++
      } else if (character === '\n') line++

      continue
    }

    if (afterQuotedField) {
      if (character === ',') {
        pushField()
        recordStarted = true
        continue
      }

      if (character !== '\r' && character !== '\n')
        throw new CanonicalCsvError(
          'UNEXPECTED_QUOTE',
          `Unexpected character after a closing quote on line ${line}`,
          { column: row.length + 1, row: line },
        )
    }

    if (character === '"') {
      if (field.length > 0 || fieldWasQuoted)
        throw new CanonicalCsvError(
          'UNEXPECTED_QUOTE',
          `Unexpected quote in an unquoted field on line ${line}`,
          { column: row.length + 1, row: line },
        )

      inQuotedField = true
      fieldWasQuoted = true
      recordStarted = true
      continue
    }

    if (character === ',') {
      pushField()
      recordStarted = true
      continue
    }

    if (character === '\r' || character === '\n') {
      pushField()
      pushRow()

      if (character === '\r' && text[index + 1] === '\n') index++
      line++
      rowStartLine = line
      continue
    }

    field += character
    recordStarted = true
  }

  if (inQuotedField)
    throw new CanonicalCsvError(
      'UNTERMINATED_QUOTED_FIELD',
      `Unterminated quoted field starting on line ${rowStartLine}`,
      { column: row.length + 1, row: rowStartLine },
    )

  if (recordStarted || row.length > 0 || field.length > 0 || fieldWasQuoted) {
    pushField()
    pushRow()
  }

  return records
}

function assertValidContract<T>(contract: CanonicalCsvContract<T>): void {
  if (contract.columns.length === 0)
    throw new CanonicalCsvError('INVALID_CONTRACT', 'CSV contract must define columns')

  const knownColumns = new Set(contract.columns)
  if (knownColumns.size !== contract.columns.length)
    throw new CanonicalCsvError('INVALID_CONTRACT', 'CSV contract columns must be unique')

  for (const requiredColumn of contract.requiredColumns)
    if (!knownColumns.has(requiredColumn))
      throw new CanonicalCsvError(
        'INVALID_CONTRACT',
        `Required column "${requiredColumn}" is not a known column`,
      )
}

export function parseCanonicalCsv<T>(text: string, contract: CanonicalCsvContract<T>): T[] {
  assertValidContract(contract)
  const records = parseCsvRecords(text)
  const [headerRecord] = records

  if (headerRecord === undefined) throw new CanonicalCsvError('EMPTY_FILE', 'CSV file is empty')

  const headers = headerRecord.cells
  const knownColumns = new Set(contract.columns)
  const seenHeaders = new Set<string>()

  for (const [index, header] of headers.entries()) {
    if (header === '')
      throw new CanonicalCsvError('BLANK_HEADER', 'CSV headers cannot be empty', {
        column: index + 1,
        row: headerRecord.line,
      })

    if (seenHeaders.has(header))
      throw new CanonicalCsvError('DUPLICATE_HEADER', `Duplicate CSV header "${header}"`, {
        column: index + 1,
        row: headerRecord.line,
      })

    if (!knownColumns.has(header))
      throw new CanonicalCsvError('UNKNOWN_HEADER', `Unknown CSV header "${header}"`, {
        column: index + 1,
        row: headerRecord.line,
      })

    seenHeaders.add(header)
  }

  for (const requiredColumn of contract.requiredColumns)
    if (!seenHeaders.has(requiredColumn))
      throw new CanonicalCsvError(
        'MISSING_REQUIRED_HEADER',
        `Missing required CSV header "${requiredColumn}"`,
        { row: headerRecord.line },
      )

  return records.slice(1).map((record) => {
    if (record.cells.length !== headers.length)
      throw new CanonicalCsvError(
        'COLUMN_COUNT_MISMATCH',
        `Expected ${headers.length} columns but found ${record.cells.length} on line ${record.line}`,
        { row: record.line },
      )

    const row = Object.fromEntries(headers.map((header, index) => [header, record.cells[index]]))

    try {
      return contract.rowSchema.parse(row)
    } catch (error) {
      throw new CanonicalCsvError('INVALID_ROW', `Invalid CSV row on line ${record.line}`, {
        cause: error,
        row: record.line,
      })
    }
  })
}

// Spreadsheet applications (Excel, Google Sheets, LibreOffice) treat a cell
// as a formula when it starts with one of these characters. Free-text fields
// (comments, crag names, etc.) are user input, so without this guard an
// exported CSV can execute attacker-controlled formulas when opened
// (CSV/Formula Injection, OWASP). Prefixing with a single quote is the
// standard mitigation: spreadsheet apps render the value as literal text.
const FORMULA_TRIGGER_PATTERN = /^[\t\r+=@-]/u

function serializeCsvCell(value: string): string {
  const needsFormulaGuard = FORMULA_TRIGGER_PATTERN.test(value)
  const guardedValue = needsFormulaGuard ? `'${value}` : value
  const requiresQuotes =
    needsFormulaGuard || guardedValue === '' || /[^\x20-\x7E]|[",]/u.test(guardedValue)
  return requiresQuotes ? `"${guardedValue.replaceAll('"', '""')}"` : guardedValue
}

export function serializeCanonicalCsv(rows: readonly object[], columns: readonly string[]): string {
  if (columns.length === 0 || new Set(columns).size !== columns.length)
    throw new CanonicalCsvError(
      'INVALID_CONTRACT',
      'CSV serialization columns must be non-empty and unique',
    )

  const records = [columns.map(serializeCsvCell).join(',')]

  for (const [rowIndex, row] of rows.entries()) {
    const values = columns.map((column, columnIndex) => {
      const value = (row as Record<string, unknown>)[column]
      if (typeof value !== 'string')
        throw new CanonicalCsvError(
          'INVALID_EXPORT_ROW',
          `Expected a string for export column "${column}"`,
          { column: columnIndex + 1, row: rowIndex + 2 },
        )

      return serializeCsvCell(value)
    })

    records.push(values.join(','))
  }

  return `${records.join(CSV_RECORD_SEPARATOR)}${CSV_RECORD_SEPARATOR}`
}

export function decodeUtf8Csv(input: ArrayBuffer | Uint8Array): string {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input)

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch (error) {
    throw new CanonicalCsvError('INVALID_UTF8', 'CSV file must use valid UTF-8 encoding', {
      cause: error,
    })
  }
}
