import { omitServerControlledFields } from '~/domain/common'

type Parser<T> = {
  parse: (input: unknown) => T
}

export function createPublicRecordMapper<TStored extends Record<string, unknown>, TPublic>(
  storedSchema: Parser<TStored>,
  publicSchema: Parser<TPublic>,
) {
  return (record: unknown) =>
    publicSchema.parse(omitServerControlledFields(storedSchema.parse(record)))
}

export function omitComments<T extends Record<string, unknown>>(record: T): Omit<T, 'comments'> {
  const { comments: _comments, ...withoutComments } = record
  return withoutComments
}
