import { fetcher } from './index'

describe('managedCookie', () => {
  describe('fetcher', () => {
    it('returns value for a cookie', async () => {
      jest.spyOn(window.document, 'cookie', 'get').mockReturnValue('_swb=bar; baz=bah')
      const actual = await fetcher(window, 'foo')
      expect(actual).toStrictEqual(['bar'])
    })

    it('sets value for a non-existent cookie', async () => {
      let cookie = ''
      jest.spyOn(window.document, 'cookie', 'get').mockImplementation(() => {
        return cookie
      })
      const cookieSet = jest.spyOn(window.document, 'cookie', 'set')
      cookieSet.mockImplementation((value: string) => {
        cookie = value
      })
      const actual = await fetcher(window, 'foo')
      expect(actual).toHaveLength(1)
      expect(cookieSet).toHaveBeenCalled()
    })

    it('sets cookie with default 400 day expiry', async () => {
      let cookie = ''
      jest.spyOn(window.document, 'cookie', 'get').mockImplementation(() => cookie)
      const cookieSet = jest.spyOn(window.document, 'cookie', 'set')
      cookieSet.mockImplementation((value: string) => {
        cookie = value
      })
      await fetcher(window, 'foo')
      const expires = new Date(cookieSet.mock.calls[0][0].match(/expires=([^;]+)/)?.[1] ?? '').getTime()
      expect(expires).toBeGreaterThan(Date.now() + 399 * 86400 * 1000)
      expect(expires).toBeLessThan(Date.now() + 401 * 86400 * 1000)
    })

    it('sets cookie with the provided ttl', async () => {
      let cookie = ''
      jest.spyOn(window.document, 'cookie', 'get').mockImplementation(() => cookie)
      const cookieSet = jest.spyOn(window.document, 'cookie', 'set')
      cookieSet.mockImplementation((value: string) => {
        cookie = value
      })
      await fetcher(window, 'foo', 30 * 86400)
      const expires = new Date(cookieSet.mock.calls[0][0].match(/expires=([^;]+)/)?.[1] ?? '').getTime()
      expect(expires).toBeGreaterThan(Date.now() + 29 * 86400 * 1000)
      expect(expires).toBeLessThan(Date.now() + 31 * 86400 * 1000)
    })

    it('returns empty list for an empty name', async () => {
      jest.spyOn(window.document, 'cookie', 'get').mockReturnValue('')
      const actual = await fetcher(window, '')
      expect(actual).toStrictEqual([])
    })

    it('returns empty list if set cookie fails', async () => {
      jest.spyOn(window.document, 'cookie', 'get').mockReturnValue('')
      const actual = await fetcher(window, 'foo')
      expect(actual).toStrictEqual([])
    })
  })
})
