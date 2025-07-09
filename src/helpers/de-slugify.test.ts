import { assert, describe, it } from 'poku'
import { deSlugify } from './de-slugify.js'

describe('deSlugify', () => {
  describe('Basic functionality', () => {
    it('should convert a simple slug to readable text with default options', () => {
      const result = deSlugify('hello-world')
      assert.equal(result, 'Hello world')
    })

    it('should convert multiple separators correctly', () => {
      const result = deSlugify('this-is-a-test')
      assert.equal(result, 'This is a test')
    })

    it('should handle single words', () => {
      const result = deSlugify('single')
      assert.equal(result, 'Single')
    })

    it('should handle empty strings', () => {
      const result = deSlugify('')
      assert.equal(result, '')
    })
  })

  describe('Capitalization options', () => {
    it('should capitalize when capitalize option is true', () => {
      const result = deSlugify('hello-world', { capitalize: true })
      assert.equal(result, 'Hello world')
    })

    it('should not capitalize when capitalize option is false', () => {
      const result = deSlugify('hello-world', { capitalize: false })
      assert.equal(result, 'hello world')
    })

    it('should use default capitalization when option is not provided', () => {
      const result = deSlugify('hello-world')
      assert.equal(result, 'Hello world')
    })
  })

  describe('Custom separators', () => {
    it('should handle underscore separators', () => {
      const result = deSlugify('hello_world_test', { separator: '_' })
      assert.equal(result, 'Hello world test')
    })

    it('should handle double dash separators', () => {
      const result = deSlugify('hello--world--test', { separator: '--' })
      assert.equal(result, 'Hello world test')
    })

    it('should handle pipe separators', () => {
      const result = deSlugify('hello|world|test', { separator: '|' })
      assert.equal(result, 'Hello world test')
    })

    it('should handle dot separators', () => {
      const result = deSlugify('hello.world.test', { separator: '.' })
      assert.equal(result, 'Hello world test')
    })

    it('should handle space separators (edge case)', () => {
      const result = deSlugify('hello world test', { separator: ' ' })
      assert.equal(result, 'Hello world test')
    })
  })

  describe('Combined options', () => {
    it('should handle custom separator without capitalization', () => {
      const result = deSlugify('hello_world_test', {
        separator: '_',
        capitalize: false,
      })
      assert.equal(result, 'hello world test')
    })

    it('should handle custom separator with capitalization', () => {
      const result = deSlugify('my--awesome--page', {
        separator: '--',
        capitalize: true,
      })
      assert.equal(result, 'My awesome page')
    })
  })

  describe('Edge cases', () => {
    it('should handle strings with only separators (empty string)', () => {
      const result = deSlugify('---', { separator: '-' })
      assert.equal(result, '')
    })

    it('should handle strings without separators', () => {
      const result = deSlugify('noSeparators')
      assert.equal(result, 'Noseparators')
    })

    it('should handle strings with mixed separators (only replaces specified)', () => {
      const result = deSlugify('hello-world_test', { separator: '-' })
      assert.equal(result, 'Hello world_test')
    })

    it('should handle strings starting with separator (trim)', () => {
      const result = deSlugify('-hello-world', { separator: '-' })
      assert.equal(result, 'Hello world')
    })

    it('should handle (trim) strings ending with separator', () => {
      const result = deSlugify('hello-world-', { separator: '-' })
      assert.equal(result, 'Hello world')
    })

    it('should handle consecutive separators', () => {
      const result = deSlugify('hello---world', { separator: '-' })
      assert.equal(result, 'Hello   world')
    })
  })

  describe('Real-world examples', () => {
    it('should handle typical URL slugs', () => {
      const testCases = [
        { input: 'about-us', expected: 'About us' },
        { input: 'contact-information', expected: 'Contact information' },
        {
          input: 'frequently-asked-questions',
          expected: 'Frequently asked questions',
        },
        { input: 'privacy-policy', expected: 'Privacy policy' },
      ]

      for (const { input, expected } of testCases) {
        const result = deSlugify(input)
        assert.equal(result, expected)
      }
    })

    it('should handle file names with underscores', () => {
      const testCases = [
        { input: 'my_file_name', expected: 'My file name' },
        { input: 'data_export_2024', expected: 'Data export 2024' },
        { input: 'user_profile_settings', expected: 'User profile settings' },
      ]

      for (const { input, expected } of testCases) {
        const result = deSlugify(input, { separator: '_' })
        assert.equal(result, expected)
      }
    })

    it('should handle breadcrumb scenarios without capitalization', () => {
      const testCases = [
        { input: 'home-page', expected: 'home page' },
        { input: 'products-category', expected: 'products category' },
        { input: 'user-account-settings', expected: 'user account settings' },
      ]

      for (const { input, expected } of testCases) {
        const result = deSlugify(input, { capitalize: false })
        assert.equal(result, expected)
      }
    })
  })

  describe('Performance and stability', () => {
    it('should handle long strings efficiently', () => {
      const longSlug = Array.from({ length: 100 }, (_, i) => `word${i}`).join(
        '-',
      )
      const result = deSlugify(longSlug)

      // Should start with capitalized first word and contain spaces
      assert.ok(result.startsWith('Word0'))
      assert.ok(result.includes(' '))

      // Should have replaced all separators
      assert.ok(!result.includes('-'))
    })

    it('should handle empty options object', () => {
      const result = deSlugify('hello-world', {})
      assert.equal(result, 'Hello world')
    })

    it('should handle undefined options', () => {
      const result = deSlugify('hello-world', undefined)
      assert.equal(result, 'Hello world')
    })
  })
})
