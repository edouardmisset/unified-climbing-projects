const collator = new Intl.Collator('fr-FR', { sensitivity: 'base' })
export const compareStringsAscending = collator.compare
