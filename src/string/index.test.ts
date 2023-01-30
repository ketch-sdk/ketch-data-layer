import { structure } from './index'

describe('string', () => {
  describe('structure', () => {
    it('returns an object with value', async () => {
      const input = 'foobar'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        value: input,
      })
    })
  })
})
