import { expect, test } from '@jest/globals'
import { fetcher } from './index'

describe('cookie', () => {
  describe('fetcher', () => {
    test('returns value for a cookie', async () => {
      const w = {
        document: {
          cookie: 'foo=bar; baz=bah',
        },
      } as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual(['bar'])
    })

    test('returns empty list for a no', async () => {
      const w = {
        document: {},
      } as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })
  })
})
