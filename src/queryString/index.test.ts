import { fetcher, structure } from './index'

describe('queryString', () => {
  describe('fetcher', () => {
    it('returns single query parameter', async () => {
      const w = {
        location: {
          search: 'foo=bar',
        },
      } as Window
      const actual = await fetcher(w, 'foo')
      expect(actual).toEqual(['bar'])
    })

    it('returns multiple query parameter', async () => {
      const w = {
        location: {
          search: 'foo=bar1&foo=bar2',
        },
      } as Window
      const actual = await fetcher(w, 'foo')
      expect(actual).toEqual(['bar1', 'bar2'])
    })

    it('returns empty list on missing parameter', async () => {
      const w = {
        location: {
          search: 'bar=foo',
        },
      } as Window
      const actual = await fetcher(w, 'foo')
      expect(actual).toEqual([])
    })

    it('returns empty list on zero', async () => {
      const w = {
        location: {
          search: 'foo=0',
        },
      } as Window
      const actual = await fetcher(w, 'foo')
      expect(actual).toEqual([])
    })

    it('returns empty list on missing name', async () => {
      const w = {
        location: {
          search: 'bar=foo',
        },
      } as Window
      const actual = await fetcher(w, '')
      expect(actual).toEqual([])
    })

    it('preserves plus signs in email addresses', async () => {
      const w = {
        location: {
          search: 'email=test+1@ketch.com',
        },
      } as Window
      const actual = await fetcher(w, 'email')
      expect(actual).toEqual(['test+1@ketch.com'])
    })

    it('handles various URL encoding scenarios', async () => {
      const w = {
        location: {
          search: 'search=hello+world&email=test+user@example.com&percent=%20test',
        },
      } as Window

      const searchResult = await fetcher(w, 'search')
      expect(searchResult).toEqual(['hello+world'])

      const emailResult = await fetcher(w, 'email')
      expect(emailResult).toEqual(['test+user@example.com'])

      const percentResult = await fetcher(w, 'percent')
      expect(percentResult).toEqual([' test']) // %20 should decode to space
    })
  })

  describe('structure', () => {
    it('returns an object with value', async () => {
      const input = 'foo=bar&baz=bah'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        foo: 'bar',
        baz: 'bah',
      })
    })

    it('preserves plus signs in email addresses', async () => {
      const input = 'email=test+1@ketch.com&name=test'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        email: 'test+1@ketch.com',
        name: 'test',
      })
    })

    it('handles various URL encoding scenarios', async () => {
      const input = 'search=hello+world&email=test+user@example.com&percent=%20test&special=%21%40%23'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        search: 'hello+world',
        email: 'test+user@example.com',
        percent: ' test', // %20 should decode to space
        special: '!@#', // %21%40%23 should decode to !@#
      })
    })

    it('handles empty values and edge cases', async () => {
      const input = 'empty=&plus=+&encoded=%2B&multiple=a+b+c'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        empty: '',
        plus: '+',
        encoded: '+', // %2B should decode to +
        multiple: 'a+b+c',
      })
    })
  })
})
