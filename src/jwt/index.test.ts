import { structure } from './index'

describe('jwt', () => {
  describe('structure', () => {
    const testJWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwi' +
      'aWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    it('returns an object with value when no verifierID is provided', async () => {
      const actual = await structure(testJWT)
      expect(actual).toMatchObject({
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
      })
    })

    it('returns raw JWT string when verifierID is provided and non-empty', async () => {
      const actual = await structure(testJWT, 'verifier123')
      expect(actual).toBe(testJWT)
      expect(typeof actual).toBe('string')
    })

    it('returns parsed JWT claims when verifierID is empty', async () => {
      const actual = await structure(testJWT, '')
      expect(actual).toMatchObject({
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
      })
    })

    it('returns parsed JWT claims when verifierID is undefined', async () => {
      const actual = await structure(testJWT, undefined)
      expect(actual).toMatchObject({
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
      })
    })
  })
})
