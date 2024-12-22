export function addParenthesis(number_: number) {
  if (number_ <= 0) {
    return ''
  }
  return `(${number_})`
}
