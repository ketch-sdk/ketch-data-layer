import { fetcher } from './index'

describe('sessionStorage', () => {
  describe('fetcher', () => {
    beforeEach(() => {
      window.sessionStorage.clear()
    })

    test('returns value for a sessionStorage item', async () => {
      window.sessionStorage.setItem('foo', 'bar')
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
