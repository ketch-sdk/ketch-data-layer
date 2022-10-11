import { expect, test } from '@jest/globals'
import { fetcher } from './index'

declare global {
  interface Window {
    [key: string]: any
  }
}

describe('global', () => {
  describe('fetcher', () => {
    test('returns value for a variable', async () => {
      const w = {} as Window
      w['foo'] = 'bar'

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual(['bar'])
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

    test('returns empty for missing property', async () => {
      const w = {} as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })
  })
})
