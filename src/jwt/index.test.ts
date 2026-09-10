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

    it('returns parsed JWT claims when the payload uses the base64url alphabet', async () => {
      // {"sub":"user01","iss":"https://idp.example.com/authorize?tenant=acme","email":"aa@example.com"}
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMDEiLCJpc3MiOiJodHRwczovL2lkcC5leGFtcGxlLmNvbS9hdXRo' +
        'b3JpemU_dGVuYW50PWFjbWUiLCJlbWFpbCI6ImFhQGV4YW1wbGUuY29tIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

      const actual = await structure(jwt)
      expect(actual).toMatchObject({
        sub: 'user01',
        iss: 'https://idp.example.com/authorize?tenant=acme',
        email: 'aa@example.com',
      })
    })

    it('returns parsed JWT claims when the payload uses the base64url alphabet for non-ASCII values', async () => {
      // {"sub":"1111","name":"北京用户","iat":1516239022}
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExIiwibmFtZSI6IuWMl-S6rOeUqOaItyIsImlhdCI6MTUxNjIzOTAy' +
        'Mn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

      const actual = await structure(jwt)
      expect(actual).toMatchObject({
        sub: '1111',
        name: '北京用户',
        iat: 1516239022,
      })
    })

    it('returns parsed JWT claims with non-ASCII values decoded as UTF-8', async () => {
      // {"sub":"1234567890","name":"José Álvarez","iat":1516239022}
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpvc8OpIMOBbHZhcmV6IiwiaWF0Ijox' +
        'NTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

      const actual = await structure(jwt)
      expect(actual).toMatchObject({
        sub: '1234567890',
        name: 'José Álvarez',
        iat: 1516239022,
      })
    })

    it('returns parsed JWT claims when the payload is not valid UTF-8', async () => {
      // {"sub":"a<0xff>b"}
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJh_2IifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

      const actual = await structure(jwt)
      expect(actual).toMatchObject({
        sub: 'aÿb',
      })
    })
  })
})
