import { expect, test } from '@jest/globals'
import {fetcher} from './index'

describe('cookie', () => {
  describe('fetcher', () => {
    test('returns value for a cookie', () => {
      const w = {
        document: {
          cookie: 'foo=bar; baz=bah',
        },
      } as Window

      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toStrictEqual(['bar'])
    })

    test('returns empty list for a no', () => {
      const w = {
        document: {},
      } as Window

      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toStrictEqual([])
    })
  })
})
