import { fetcher } from './index'

declare global {
  interface Window {
    [key: string]: any
  }
}

describe('window', () => {
  describe('fetcher', () => {
    test('returns empty list for an empty name', async () => {
      const w = {} as Window
      w['foo'] = 'bar'

      const actual = await fetcher(w, '')
      expect(actual).toStrictEqual([])
    })

    test('returns value for a variable', async () => {
      const w = {} as Window
      w['foo'] = 'bar'

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual(['bar'])
    })

    test('returns value for a variable with window prefix', async () => {
      const w = {} as Window
      w['foo'] = 'bar'

      const actual = await fetcher(w, 'window.foo')
      expect(actual).toStrictEqual(['bar'])
    })

    test('returns empty list an unrecognized value', async () => {
      const w = {} as Window
      w['foo'] = []

      const actual = await fetcher(w, 'window.foo')
      expect(actual).toStrictEqual([])
    })

    test('returns empty list an undefined name', async () => {
      const w = {} as Window
      w['foo'] = undefined

      const actual = await fetcher(w, 'window.foo.bar')
      expect(actual).toStrictEqual([])
    })

    test('returns string form of a numeric value', async () => {
      const w = {} as Window
      w['foo'] = 123

      const actual = await fetcher(w, 'window.foo')
      expect(actual).toStrictEqual(['123'])
    })

    test('returns value for nested variable', async () => {
      const w = {} as Window
      w['foo'] = {
        foo: 'bar',
      }

      const actual = await fetcher(w, 'foo.foo')
      expect(actual).toStrictEqual(['bar'])
    })

    test('returns empty for a null', async () => {
      const w = {} as Window
      w['foo'] = null

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    test('returns empty for an undefined', async () => {
      const w = {} as Window
      w['foo'] = undefined

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    test('returns result of a function call', async () => {
      const w = {} as Window
      w['foo'] = () => 'bar'

      const actual = await fetcher(w, 'foo()')
      expect(actual).toStrictEqual(['bar'])
    })

    test('returns result object returned from a function call', async () => {
      const w = {} as Window
      w['foo'] = () => ({ foo: 'bar' })

      const actual = await fetcher(w, 'foo().foo')
      expect(actual).toStrictEqual(['bar'])
    })

    test('returns empty for missing property', async () => {
      const w = {} as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })
  })
})
