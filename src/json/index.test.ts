import { structure } from './index'

describe('json', () => {
  describe('structure', () => {
    it('returns an object with value for object', async () => {
      const input = '{"foo": "bar", "baz": "bah"}'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        foo: 'bar',
        baz: 'bah',
      })
    })

    it('returns an object with value for string', async () => {
      const input = '"bah"'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        value: 'bah',
      })
    })

    it('returns an object if input in an object', async () => {
      const input = { foo: 'bar', baz: 'bah' }
      const actual = await structure(input)
      expect(actual).toMatchObject({
        foo: 'bar',
        baz: 'bah',
      })
    })
  })
})
