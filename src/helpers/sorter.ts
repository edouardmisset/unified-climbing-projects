import { type Ascent } from "~/types/ascent"
import { convertGradeToNumber } from "./converter"

export const sortByDescendingGrade = (
  { topoGrade: aGrade }: Ascent,
  { topoGrade: bGrade }: Ascent,
): number =>
  convertGradeToNumber(bGrade) - convertGradeToNumber(aGrade)
