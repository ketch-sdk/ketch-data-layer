import { fetcher, getCookie, setCookie } from './index'

describe('cookie', () => {
  describe('fetcher', () => {
    it('returns value for a cookie', async () => {
      const w = {
        document: {
          cookie: 'foo=bar; baz=bah',
        },
      } as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual(['bar'])
    })

    it('returns empty list for a non-existent cookie', async () => {
      const w = {
        document: {
          cookie: '',
        },
      } as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    it('returns empty list for a zero', async () => {
      const w = {
        document: {
          cookie: '0',
        },
      } as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    it('returns empty list for an empty name', async () => {
      const w = {
        document: {},
      } as Window

      const actual = await fetcher(w, '')
      expect(actual).toStrictEqual([])
    })
  })

  describe('getCookie', () => {
    it('returns value of cookie', () => {
      const w = {
        document: {
          cookie: 'foo=bar',
        },
      } as any as Window
      expect(getCookie(w, 'foo')).toBe('bar')
    })
  })

  describe('setCookie', () => {
    it('sets value of cookie', () => {
      const w = {
        document: {
          cookie: '0',
          location: new URL('https://localhost'),
        },
      } as any as Window
      setCookie(w, 'foo', 123)
      expect(w.document.cookie).toBe('foo=123; path=/; SameSite=None; Secure')
    })

    it('sets value of cookie with ttl', () => {
      const w = {
        document: {
          cookie: '0',
          location: new URL('https://localhost'),
        },
      } as any as Window
      setCookie(w, 'foo', 123, 456)
      expect(w.document.cookie.replace(/expires.+/, '')).toBe('foo=123; path=/; SameSite=None; Secure; ')
    })
  })
})
