import { encoding } from './index'

describe('base64', () => {
  describe('encoding', () => {
    it('decodes the base64 and url encoded string', async () => {
      const input = ['dGVzdEBlbWFpbC5jb20%3D']
      const actual = await encoding(input)
      expect(actual).toStrictEqual(['test@email.com'])
    })

    it('decodes the base64 string without url encoding', async () => {
      const input = ['dGVzdEBlbWFpbC5jb20=']
      const actual = await encoding(input)
      expect(actual).toStrictEqual(['test@email.com'])
    })

    it('decodes the base64 encoded json', async () => {
      const input = ['eyJlbWFpbCI6ICJ0ZXN0QGVtYWlsLmNvbSIsICJuYW1lIjogInRlc3QifQ%3D%3D']
      const actual = await encoding(input)
      expect(actual).toStrictEqual(['{"email": "test@email.com", "name": "test"}'])
    })

    it('does not affect json', async () => {
      const input = [{ foo: 'val1', bar: 2 }]
      const actual = await encoding(input)
      expect(actual).toStrictEqual([{ foo: 'val1', bar: 2 }])
    })

    it('handles list of inputs', async () => {
      const input = ['dGVzdEBlbWFpbC5jb20%3D', { foo: 'val1', bar: 2 }]
      const actual = await encoding(input)
      expect(actual).toStrictEqual(['test@email.com', { foo: 'val1', bar: 2 }])
    })
  })
})
