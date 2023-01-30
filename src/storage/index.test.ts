import fetcher from './fetcher'

describe('storage', () => {
  const storage = {
    getItem: jest.fn(),
  }
  const w = {
    localStorage: storage,
  } as any as Window

  describe('fetcher', () => {
    it('returns empty if undefined window', async () => {
      return expect(fetcher('localStorage')(undefined as any as Window, 'foo')).resolves.toStrictEqual([])
    })

    it('returns empty if empty name', () => {
      return expect(fetcher('localStorage')(w, '')).resolves.toStrictEqual([])
    })

    it('returns empty if getItem returns null', () => {
      storage.getItem.mockReturnValue(null)
      return expect(fetcher('localStorage')(w, 'foo')).resolves.toStrictEqual([])
    })

    it('returns empty if getItem returns "0"', () => {
      storage.getItem.mockReturnValue('0')
      return expect(fetcher('localStorage')(w, 'foo')).resolves.toStrictEqual([])
    })

    it('returns empty if getItem throws', () => {
      storage.getItem.mockImplementation(() => {
        throw Error('oops')
      })
      return expect(fetcher('localStorage')(w, 'foo')).resolves.toStrictEqual([])
    })

    it('returns value array if getItem returns', () => {
      storage.getItem.mockReturnValue('bar')
      return expect(fetcher('localStorage')(w, 'foo')).resolves.toStrictEqual(['bar'])
    })
  })
})
