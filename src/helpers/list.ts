// ? What does it mean to pass undefined as first arg ?
// => The runtime's default locale is used when undefined is passed ~ MDN
const createListFormatter =
  (type: 'disjunction' | 'conjunction') =>
  (list: string[] | readonly string[]) =>
    new Intl.ListFormat(undefined, { type }).format(list)

export const disjunctiveListFormatter = createListFormatter('disjunction')
