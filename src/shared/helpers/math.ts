const roundTo = (powerOfTen: number) => (numberToRound: number) =>
  Math.round(numberToRound / powerOfTen) * powerOfTen

export const roundToTen = roundTo(10)
