# Canonical CSV contract

The canonical CSV format is the portable import and export format for climbing data. Parsing and
serialization are implemented in browser-compatible modules and do not contact Convex or another
service.

Downloadable header-only templates are available at:

- `/templates/ascents.csv`
- `/templates/training-sessions.csv`

## Shared rules

- Files use valid UTF-8. A UTF-8 byte-order mark is accepted but never emitted.
- Headers and enum values are case-sensitive.
- Required headers must be present. Optional headers may be absent, and headers may be in any order.
- Unknown, duplicate, or empty headers are rejected.
- Every data row must contain the same number of cells as its header row.
- Dates use the calendar format `YYYY-MM-DD`.
- Empty optional cells mean that the field is absent.
- Commas, double quotes, CR/LF newlines, control characters, non-ASCII text, and empty values are
  quoted on export. A double quote inside a quoted cell is written as `""`.
- Exports always use the fixed column order shown below and CRLF record separators.
- `_id`, `_creationTime`, `ownerId`, `contentFingerprint`, `importJobId`, `points`, and `load` are
  never exported.

Formula neutralization is intentionally out of scope. These files are for portability and
re-import and must not be described as spreadsheet-safe.

## Ascents

Fixed export header:

```csv
discipline,name,grade,crag,date,style,tries,area,comments,height,holds,personalGrade,profile,rating
```

Required headers are `discipline`, `name`, `grade`, `crag`, `date`, `style`, and `tries`.

Optional headers are `area`, `comments`, `height`, `holds`, `personalGrade`, `profile`, and
`rating`.

Values:

- `discipline`: `Sport`, `Bouldering`, or `Multi-Pitch`.
- `style`: `Onsight`, `Flash`, or `Redpoint`.
- `grade` and `personalGrade`: French grades from `1a` through `9c+`.
- `tries`: a positive integer.
- `height`: a non-negative integer.
- `rating`: an integer from 0 through 5.
- `holds`: `Crimp`, `Jug`, `Pocket`, `Sloper`, `Pinch`, `Crack`, or `Undercling`.
- `profile`: `Vertical`, `Overhang`, `Slab`, `Roof`, `Arête`, `Dihedral`, or `Traverse`.

## Training sessions

Fixed export header:

```csv
date,type,discipline,location,anatomicalRegion,energySystem,comments,intensity,volume
```

Required headers are `date` and `type`. All other headers are optional.

Values:

- `type`: `Outdoor`, `Contact Strength`, `Power`, `Max Strength`, `Endurance`, `Power Endurance`,
  `Strength Endurance`, `Routine`, `Finger Board`, `Core`, `Stretching`, `Skill`, `Stamina`, or
  `Chill`.
- `discipline`: empty, `Sport`, `Bouldering`, or `Multi-Pitch`.
- `anatomicalRegion`: empty, `Arms`, `Fingers`, or `General`.
- `energySystem`: empty, `Anaerobic Alactic`, `Anaerobic Lactic`, or `Aerobic`.
- `intensity` and `volume`: empty or an integer from 0 through 100.

## Code API

`src/domain/canonical/csv.ts` contains the shared parser, serializer, strict UTF-8 decoder, and
structured `CanonicalCsvError` type. `src/domain/canonical/csv-contract.ts` exposes the ascent and
training-session parsers, serializers, and header-only template strings.

Parsing errors identify their category and, when applicable, the physical row and column. Domain
validation failures retain the underlying schema error as their `cause`.
