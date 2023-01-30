import { structure } from './index'

describe('semicolon', () => {
  describe('structure', () => {
    it('returns an object with values', async () => {
      const input = 'foo=bar;baz=bah'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        foo: 'bar',
        baz: 'bah',
      })
    })
  })
})
