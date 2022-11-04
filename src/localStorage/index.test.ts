import { fetcher } from './index'

describe('localStorage', () => {
  describe('fetcher', () => {
    beforeEach(() => {
      window.localStorage.clear()
    })

    test('returns value for a localStorage item', async () => {
      window.localStorage.setItem('foo', 'bar')
      const actual = await fetcher(window, 'foo')
      expect(actual).toStrictEqual(['bar'])
    })

    test('returns empty list for a non-existent item', async () => {
      const actual = await fetcher(window, 'foo')
      expect(actual).toStrictEqual([])
    })

    test('returns empty list for a non-existent name', async () => {
      const actual = await fetcher(window, '')
      expect(actual).toStrictEqual([])
    })
  })
})
