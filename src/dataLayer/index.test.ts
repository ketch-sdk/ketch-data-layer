import { fetcher } from './index'

describe('dataLayer', () => {
  describe('fetcher', () => {
    test('returns value for a dataLayer', async () => {
      const w = {
        dataLayer: [{ foo: 'bar' }],
      } as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual(['bar'])
    })

    test('returns empty for a mismatched dataLayer', async () => {
      const w = {
        dataLayer: [{ bar: 'foo' }],
      } as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    test('returns empty for a zero', async () => {
      const w = {
        dataLayer: [{ foo: 0 }],
      } as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    test('returns empty for a empty dataLayer', async () => {
      const w = {
        dataLayer: [] as any[],
      } as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    test('returns empty for a missing dataLayer', async () => {
      const w = {} as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })
  })
})
