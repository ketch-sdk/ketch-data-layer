import { fetcher } from './index'

describe('managedCookie', () => {
  describe('fetcher', () => {
    test('returns value for a cookie', async () => {
      document.cookie = '_swb=bar; baz=bah'
      const actual = await fetcher(window, 'foo')
      expect(actual).toStrictEqual(['bar'])
    })

    test('sets value for a non-existent cookie', async () => {
      const actual = await fetcher(window, 'foo')
      expect(actual).not.toBeFalsy()
    })

    test('returns empty list for an empty name', async () => {
      const actual = await fetcher(window, '')
      expect(actual).toStrictEqual([])
    })
  })
})
