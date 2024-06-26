import { encoding } from './index'

describe('noop', () => {
  describe('encoding', () => {
    it('returns string value', async () => {
      const input = ['foobar']
      const actual = await encoding(input)
      expect(actual).toBe(input)
    })

    it('returns json value', async () => {
      const input = [{foo: 'val1', bar: 2}]
      const actual = await encoding(input)
      expect(actual).toBe(input)
    })

    it('handles list of inputs', async () => {
      const input = ['foobar', {foo: 'val1', bar: 2}]
      const actual = await encoding(input)
      expect(actual).toBe(input)
    })
  })
})
