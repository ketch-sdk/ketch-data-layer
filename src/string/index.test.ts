import { expect, test } from '@jest/globals'
import { structure } from './index'

describe('string', () => {
  describe('structure', () => {
    test('returns an object with value', async () => {
      const input = 'foobar'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        value: input,
      })
    })
  })
})
