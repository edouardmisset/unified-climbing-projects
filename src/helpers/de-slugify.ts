import { capitalize as capitalizeFunction } from '@edouardmisset/text'

/**
 * Configuration options for the deSlugify function.
 */
type DeSlugifyOptions = {
  /**
   * Whether to capitalize the first letter of the first word.
   * @default true
   */
  capitalize?: boolean
  /**
   * The separator used in the slug (e.g., '-', '_', '.', etc.).
   * @default '-'
   */
  separator?: string
}

/**
 * Converts a slug string to a human-readable format by replacing separators with spaces
 * and optionally capitalizing the first letter.
 *
 * This function is useful for converting URL-friendly slugs back to readable text,
 * commonly used in breadcrumbs, page titles, or form labels.
 *
 * @param slug - The slug string to convert
 * @param options - Configuration options for the conversion
 * @param options.capitalize - Whether to capitalize the first letter of the result (default: true)
 * @param options.separator - The separator to replace with spaces (default: '-')
 * @returns A human-readable string with separators replaced by spaces
 *
 * @example
 * ```typescript
 * // Basic usage with default options
 * deSlugify('hello-world') // 'Hello world'
 * deSlugify('my-awesome-page') // 'My awesome page'
 *
 * // Custom separator
 * deSlugify('hello_world_test', { separator: '_' }) // 'Hello world test'
 *
 * // Without capitalization
 * deSlugify('hello-world', { capitalize: false }) // 'hello world'
 *
 * // Complex separators
 * deSlugify('hello--world--test', { separator: '--' }) // 'Hello world test'
 *
 * // Edge cases
 * deSlugify('') // ''
 * deSlugify('single') // 'Single'
 * deSlugify('no-separators') // 'No separators'
 * ```
 */
export function deSlugify(slug: string, options?: DeSlugifyOptions): string {
  const { capitalize = true, separator = '-' } = options ?? {}

  const cleanedText = slug.replaceAll(separator, ' ').trim()

  return capitalize ? capitalizeFunction(cleanedText) : cleanedText
}
