import { expect, test } from '@jest/globals'
import {structure} from './index'

describe('string', () => {
  describe('structure', () => {
    test('returns an object with value', () => {
      const input = 'foobar'
      const actual = structure(input)
      expect(actual).resolves.toMatchObject({
        value: input,
      })
    })
  })
})
