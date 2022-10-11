import { expect, test } from '@jest/globals'
import {fetcher} from './index'

describe('dataLayer', () => {
  describe('fetcher', () => {
    test('returns value for a dataLayer', () => {
      const w = {
        dataLayer: [
          {'foo': 'bar'}
        ],
      } as Window

      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toStrictEqual(['bar'])
    })

    test('returns empty for a mismatched dataLayer', () => {
      const w = {
        dataLayer: [
          {'bar': 'foo'}
        ],
      } as Window

      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toStrictEqual([])
    })

    test('returns empty for a empty dataLayer', () => {
      const w = {
        dataLayer: [] as any[],
      } as Window

      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toStrictEqual([])
    })

    test('returns empty for a missing dataLayer', () => {
      const w = {} as Window

      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toStrictEqual([])
    })
  })
})
