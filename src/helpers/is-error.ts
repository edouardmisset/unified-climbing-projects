import type { CustomError } from '~/schema/generic'

export const isError = <T>(data: CustomError | T): data is CustomError =>
  (data as CustomError).error !== undefined
