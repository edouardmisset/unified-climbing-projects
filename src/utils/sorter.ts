import { Ascent } from "@/types/ascent"
import { convertAscentGradeToNumber } from "./converter"

export const sortByDescendingGrade = (
  { topoGrade: aGrade }: Ascent,
  { topoGrade: bGrade }: Ascent,
): number =>
  convertAscentGradeToNumber(bGrade) - convertAscentGradeToNumber(aGrade)
