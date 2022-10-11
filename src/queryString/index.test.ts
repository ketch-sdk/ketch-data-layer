import { expect, test } from '@jest/globals'
import {fetcher, structure} from './index'

describe('queryString', () => {
  describe('fetcher', () => {
    test('returns single query parameter', () => {
      const w = {
        location: {
          search: 'foo=bar',
        },
      } as Window
      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toEqual(['bar'])
    })

    test('returns multiple query parameter', () => {
      const w = {
        location: {
          search: 'foo=bar1&foo=bar2',
        },
      } as Window
      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toEqual(['bar1', 'bar2'])
    })

    test('returns empty list on missing parameter', () => {
      const w = {
        location: {
          search: 'bar=foo',
        },
      } as Window
      const actual = fetcher(w, 'foo')
      expect(actual).resolves.toEqual([])
    })

  })

  describe('structure', () => {
    test('returns an object with value', () => {
      const input = 'foo=bar&baz=bah'
      const actual = structure(input)
      expect(actual).resolves.toMatchObject({
        foo: 'bar',
        baz: 'bah',
      })
    })
  })
})
