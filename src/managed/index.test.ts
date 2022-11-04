import { fetcher } from './index'

describe('managedCookie', () => {
  describe('fetcher', () => {
    test('returns value for a cookie', async () => {
      const w = {
        document: {
          cookie: '_swb=bar; baz=bah',
        },
      } as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual(['bar'])
    })

    test('returns empty list for a non-existent cookie', async () => {
      const w = {
        document: {},
      } as Window

      const actual = await fetcher(w, '')
      expect(actual).toStrictEqual([])
    })

    test('returns empty list for an empty name', async () => {
      const w = {
        document: {},
      } as Window

      const actual = await fetcher(w, '')
      expect(actual).toStrictEqual([])
    })
  })
})
