import { uuidv4 } from './uuid'

const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('uuidv4', () => {
  // jsdom 20 provides crypto.getRandomValues but not crypto.randomUUID,
  // so the default path under test is the fallback.
  it('falls back to getRandomValues and produces an RFC 4122 version 4 UUID', () => {
    expect(globalThis.crypto.randomUUID).toBeUndefined()
    expect(uuidv4()).toMatch(V4)
  })

  it('produces a different value on each call', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 100; i++) {
      seen.add(uuidv4())
    }
    expect(seen.size).toBe(100)
  })

  it('uses crypto.randomUUID when the runtime provides it', () => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', { value: () => 'fixed', configurable: true })
    try {
      expect(uuidv4()).toBe('fixed')
    } finally {
      delete (globalThis.crypto as any).randomUUID
    }
  })

  it('throws when the runtime has no crypto at all', () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto')
    Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true })
    try {
      expect(() => uuidv4()).toThrow()
    } finally {
      if (original) {
        Object.defineProperty(globalThis, 'crypto', original)
      } else {
        delete (globalThis as any).crypto
      }
    }
  })
})
