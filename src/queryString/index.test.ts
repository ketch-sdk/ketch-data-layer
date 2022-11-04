import { fetcher, structure } from './index'

describe('queryString', () => {
  describe('fetcher', () => {
    test('returns single query parameter', async () => {
      const w = {
        location: {
          search: 'foo=bar',
        },
      } as Window
      const actual = await fetcher(w, 'foo')
      expect(actual).toEqual(['bar'])
    })

    test('returns multiple query parameter', async () => {
      const w = {
        location: {
          search: 'foo=bar1&foo=bar2',
        },
      } as Window
      const actual = await fetcher(w, 'foo')
      expect(actual).toEqual(['bar1', 'bar2'])
    })

    test('returns empty list on missing parameter', async () => {
      const w = {
        location: {
          search: 'bar=foo',
        },
      } as Window
      const actual = await fetcher(w, 'foo')
      expect(actual).toEqual([])
    })

    test('returns empty list on zero', async () => {
      const w = {
        location: {
          search: 'foo=0',
        },
      } as Window
      const actual = await fetcher(w, 'foo')
      expect(actual).toEqual([])
    })

    test('returns empty list on missing name', async () => {
      const w = {
        location: {
          search: 'bar=foo',
        },
      } as Window
      const actual = await fetcher(w, '')
      expect(actual).toEqual([])
    })
  })

  describe('structure', () => {
    test('returns an object with value', async () => {
      const input = 'foo=bar&baz=bah'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        foo: 'bar',
        baz: 'bah',
      })
    })
  })
})
