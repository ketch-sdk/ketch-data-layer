import { fetcher } from './index'

describe('localStorage', () => {
  describe('fetcher', () => {
    beforeEach(() => window.localStorage.clear())

    it('returns value for a localStorage item', async () => {
      window.localStorage.setItem('foo', 'bar')
      const actual = await fetcher(window, 'foo')
      expect(actual).toStrictEqual(['bar'])
    })

    it('returns empty list for a zero', async () => {
      window.localStorage.setItem('foo', '0')
      const actual = await fetcher(window, 'foo')
      expect(actual).toStrictEqual([])
    })

    it('returns empty list for a non-existent item', async () => {
      const actual = await fetcher(window, 'foo')
      expect(actual).toStrictEqual([])
    })

    it('returns empty list for a non-existent name', async () => {
      const actual = await fetcher(window, '')
      expect(actual).toStrictEqual([])
    })
  })
})
