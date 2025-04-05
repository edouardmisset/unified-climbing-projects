import { useQueryState } from 'nuqs'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import {
  type Ascent,
  ascentStyleSchema,
  climbingDisciplineSchema,
  gradeSchema,
} from '~/schema/ascent'

type UseAscentsQueryStateReturn = {
  selectedYear: OrAll<string>
  selectedDiscipline: OrAll<Ascent['climbingDiscipline']>
  selectedStyle: OrAll<Ascent['style']>
  selectedCrag: OrAll<Ascent['crag']>
  selectedGrade: OrAll<Ascent['topoGrade']>
  setYear: (year: OrAll<string>) => void
  setDiscipline: (discipline: OrAll<Ascent['climbingDiscipline']>) => void
  setStyle: (style: OrAll<Ascent['style']>) => void
  setCrag: (crag: OrAll<Ascent['crag']>) => void
  setGrade: (grade: OrAll<Ascent['topoGrade']>) => void
}

export const useAscentsQueryState = (): UseAscentsQueryStateReturn => {
  const [selectedYear, setYear] = useQueryState<OrAll<string>>('year', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : value),
  })
  const [selectedDiscipline, setDiscipline] = useQueryState<
    OrAll<Ascent['climbingDiscipline']>
  >('discipline', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : climbingDisciplineSchema.parse(value),
  })
  const [selectedStyle, setStyle] = useQueryState<OrAll<Ascent['style']>>(
    'style',
    {
      defaultValue: ALL_VALUE,
      parse: value =>
        value === ALL_VALUE ? ALL_VALUE : ascentStyleSchema.parse(value),
    },
  )
  const [selectedCrag, setCrag] = useQueryState<OrAll<Ascent['crag']>>('crag', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : value),
  })
  const [selectedGrade, setGrade] = useQueryState<OrAll<Ascent['topoGrade']>>(
    'grade',
    {
      defaultValue: ALL_VALUE,
      parse: value =>
        value === ALL_VALUE ? ALL_VALUE : gradeSchema.parse(value),
    },
  )

  return {
    selectedYear,
    selectedDiscipline,
    selectedStyle,
    selectedCrag,
    selectedGrade,
    setYear,
    setDiscipline,
    setStyle,
    setCrag,
    setGrade,
  }
}
