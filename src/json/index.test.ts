import { expect, test } from '@jest/globals'
import { structure } from './index'

describe('json', () => {
  describe('structure', () => {
    test('returns an object with value', async () => {
      const input = '{"foo": "bar", "baz": "bah"}'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        foo: 'bar',
        baz: 'bah',
      })
    })
  })
})
