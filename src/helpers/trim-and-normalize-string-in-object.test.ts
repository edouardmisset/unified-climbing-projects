import { assert, describe, it } from 'poku'
import { trimAndNormalizeStringsInObject } from './trim-and-normalize-string-in-object.js'

describe('trimAndNormalizeStringsInObject', () => {
  it('should trim and normalize string values', () => {
    const input = {
      name: '  John Doe  ',
      email: 'john@example.com  ',
    }
    const result = trimAndNormalizeStringsInObject(input)

    assert.equal(result.name, 'John Doe')
    assert.equal(result.email, 'john@example.com')
  })

  it('should handle mixed value types', () => {
    const input = {
      name: '  Alice  ',
      age: 30,
      isActive: true,
    }
    const result = trimAndNormalizeStringsInObject(input)

    assert.equal(result.name, 'Alice')
    assert.equal(result.age, 30)
    assert.equal(result.isActive, true)
  })

  it('should handle empty objects', () => {
    const result = trimAndNormalizeStringsInObject({})

    assert.deepEqual(result, {})
  })

  it('should trim various whitespace types', () => {
    const input = { text: ' \t\ntext with tabs and newlines\t\n ' }
    const result = trimAndNormalizeStringsInObject(input)

    assert.equal(result.text, 'text with tabs and newlines')
  })

  it('should preserve internal whitespace', () => {
    const input = { text: '  multiple   internal   spaces  ' }
    const result = trimAndNormalizeStringsInObject(input)

    assert.equal(result.text, 'multiple   internal   spaces')
  })

  it('should handle empty and whitespace-only strings', () => {
    const input = {
      empty: '',
      whitespace: '     ',
    }
    const result = trimAndNormalizeStringsInObject(input)

    assert.equal(result.empty, '')
    assert.equal(result.whitespace, '')
  })

  it('should normalize combining characters to NFC', () => {
    const input = { text: 'cafe\u0301' }
    const result = trimAndNormalizeStringsInObject(input)

    assert.equal(result.text, 'café')

    assert.equal(typeof result.text, 'string')
    if (typeof result.text === 'string') {
      assert.equal(result.text.length, 4)
    }
  })

  it('should normalize AND trim', () => {
    const input = { text: '  cafe\u0301  ' }
    const result = trimAndNormalizeStringsInObject(input)

    assert.equal(result.text, 'café')
  })

  it('should process multiple string properties', () => {
    const input = {
      firstName: '  John  ',
      lastName: '  Doe  ',
      city: ' Paris ',
    }
    const result = trimAndNormalizeStringsInObject(input)

    assert.equal(result.firstName, 'John')
    assert.equal(result.lastName, 'Doe')
    assert.equal(result.city, 'Paris')
  })

  it('should preserve null and undefined values', () => {
    const input = {
      nullValue: null,
      undefinedValue: undefined,
    }
    const result = trimAndNormalizeStringsInObject(input)

    assert.equal(result.nullValue, null)
    assert.equal(result.undefinedValue, undefined)
  })

  it('should preserve arrays without processing', () => {
    const input = {
      items: ['  item1  ', '  item2  '],
    }
    const result = trimAndNormalizeStringsInObject(input)

    assert.deepEqual(result.items, ['  item1  ', '  item2  '])
  })

  it('should preserve nested objects without processing', () => {
    const input = {
      nested: {
        value: '  untrimmed  ',
      },
    }
    const result = trimAndNormalizeStringsInObject(input)

    assert.deepEqual(result.nested, { value: '  untrimmed  ' })
  })

  it('should return a new object without mutating original', () => {
    const input = { text: '  original  ' }
    const result = trimAndNormalizeStringsInObject(input)

    assert.equal(result.text, 'original')
    assert.equal(input.text, '  original  ')
    assert.notEqual(result, input)
  })

  it('should handle strings with emoji', () => {
    const input = { text: '  Hello 👋  ' }
    const result = trimAndNormalizeStringsInObject(input)

    assert.equal(result.text, 'Hello 👋')
  })
})
