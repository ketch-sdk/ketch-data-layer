import { structure } from './index'

describe('jwt', () => {
  describe('structure', () => {
    test('returns an object with value', async () => {
      const input =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwi' +
        'aWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      const actual = await structure(input)
      expect(actual).toMatchObject({
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
      })
    })
  })
})
