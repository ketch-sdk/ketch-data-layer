import { expect, test } from '@jest/globals'
import {fetcher} from './index'

declare global {
  interface Window {
    [key: string]: any
  }
}

describe('global', () => {
  describe('fetcher', () => {
    test('returns value for a variable', () => {
      const w = {} as Window
      w['foo'] = 'bar'

      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toStrictEqual(['bar'])
    })

    test('returns value for nested variable', () => {
      const w = {} as Window
      w['foo'] = {
        'foo': 'bar',
      }

      const actual = fetcher(w, 'foo.foo')
      expect(actual).resolves.toStrictEqual(['bar'])
    })

    test('returns empty for a null', () => {
      const w = {} as Window
      w['foo'] = null

      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toStrictEqual([])
    })

    test('returns empty for an undefined', () => {
      const w = {} as Window
      w['foo'] = undefined

      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toStrictEqual([])
    })

    test('returns empty for missing property', () => {
      const w = {} as Window

      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toStrictEqual([])
    })
  })
})
