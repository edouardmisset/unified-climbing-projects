import { describe, expect, it } from 'vitest'
import { trimAndNormalizeStringsInObject } from './trim-and-normalize-string-in-object.js'

describe('trimAndNormalizeStringsInObject', () => {
  it('should trim and normalize string values', () => {
    const input = {
      name: '  John Doe  ',
      email: 'john@example.com  ',
    }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.name).toBe('John Doe')
    expect(result.email).toBe('john@example.com')
  })

  it('should handle mixed value types', () => {
    const input = {
      name: '  Alice  ',
      age: 30,
      isActive: true,
    }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.name).toBe('Alice')
    expect(result.age).toBe(30)
    expect(result.isActive).toBe(true)
  })

  it('should handle empty objects', () => {
    const result = trimAndNormalizeStringsInObject({})

    expect(result).toEqual({})
  })

  it('should trim various whitespace types', () => {
    const input = { text: ' \t\ntext with tabs and newlines\t\n ' }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.text).toBe('text with tabs and newlines')
  })

  it('should preserve internal whitespace', () => {
    const input = { text: '  multiple   internal   spaces  ' }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.text).toBe('multiple   internal   spaces')
  })

  it('should handle empty and whitespace-only strings', () => {
    const input = {
      empty: '',
      whitespace: '     ',
    }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.empty).toBe('')
    expect(result.whitespace).toBe('')
  })

  it('should normalize combining characters to NFC', () => {
    const input = { text: 'cafe\u0301' }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.text).toBe('café')

    expect(typeof result.text).toBe('string')
    if (typeof result.text === 'string') {
      expect(result.text.length).toBe(4)
    }
  })

  it('should normalize AND trim', () => {
    const input = { text: '  cafe\u0301  ' }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.text).toBe('café')
  })

  it('should process multiple string properties', () => {
    const input = {
      firstName: '  John  ',
      lastName: '  Doe  ',
      city: ' Paris ',
    }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.firstName).toBe('John')
    expect(result.lastName).toBe('Doe')
    expect(result.city).toBe('Paris')
  })

  it('should preserve null and undefined values', () => {
    const input = {
      nullValue: null,
      undefinedValue: undefined,
    }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.nullValue).toBe(null)
    expect(result.undefinedValue).toBe(undefined)
  })

  it('should preserve arrays without processing', () => {
    const input = {
      items: ['  item1  ', '  item2  '],
    }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.items).toEqual(['  item1  ', '  item2  '])
  })

  it('should preserve nested objects without processing', () => {
    const input = {
      nested: {
        value: '  untrimmed  ',
      },
    }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.nested).toEqual({ value: '  untrimmed  ' })
  })

  it('should return a new object without mutating original', () => {
    const input = { text: '  original  ' }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.text).toBe('original')
    expect(input.text).toBe('  original  ')
    expect(result).not.toBe(input)
  })

  it('should handle strings with emoji', () => {
    const input = { text: '  Hello 👋  ' }
    const result = trimAndNormalizeStringsInObject(input)

    expect(result.text).toBe('Hello 👋')
  })
})
