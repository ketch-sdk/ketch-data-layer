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

    test('returns empty list for a non-existent cookie', async () => {
      const w = {
        document: {
          cookie: '',
        },
      } as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    test('returns empty list for a zero', async () => {
      const w = {
        document: {
          cookie: '0',
        },
      } as Window

      const actual = await fetcher(w, 'foo')
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
