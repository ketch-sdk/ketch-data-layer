import { expect, test } from '@jest/globals'
import {structure} from './index'

describe('json', () => {
  describe('structure', () => {
    test('returns an object with value', () => {
      const input = '{"foo": "bar", "baz": "bah"}'
      const actual = structure(input)
      expect(actual).resolves.toMatchObject({
        foo: 'bar',
        baz: 'bah',
      })
    })
  })
})
