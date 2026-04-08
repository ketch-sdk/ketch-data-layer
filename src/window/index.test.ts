import { fetcher } from './index'

declare global {
  interface Window {
    [key: string]: any
  }
}

describe('window', () => {
  describe('fetcher', () => {
    it('returns empty list for an empty name', async () => {
      const w = {} as Window
      w['foo'] = 'bar'

      const actual = await fetcher(w, '')
      expect(actual).toStrictEqual([])
    })

    it('returns value for a variable', async () => {
      const w = {} as Window
      w['foo'] = 'bar'

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual(['bar'])
    })

    it('returns value for a variable with window prefix', async () => {
      const w = {} as Window
      w['foo'] = 'bar'

      const actual = await fetcher(w, 'window.foo')
      expect(actual).toStrictEqual(['bar'])
    })

    it('returns empty list for an object', async () => {
      const w = {} as Window
      w['foo'] = {}

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    it('returns empty list an unrecognized value', async () => {
      const w = {} as Window
      w['foo'] = []

      const actual = await fetcher(w, 'window.foo')
      expect(actual).toStrictEqual([])
    })

    it('returns empty list an undefined name', async () => {
      const w = {} as Window
      w['foo'] = undefined

      const actual = await fetcher(w, 'window.foo.bar')
      expect(actual).toStrictEqual([])
    })

    it('returns string form of a numeric value', async () => {
      const w = {} as Window
      w['foo'] = 123

      const actual = await fetcher(w, 'window.foo')
      expect(actual).toStrictEqual(['123'])
    })

    it('returns value for nested variable', async () => {
      const w = {} as Window
      w['foo'] = {
        foo: 'bar',
      }

      const actual = await fetcher(w, 'foo.foo')
      expect(actual).toStrictEqual(['bar'])
    })

    it('returns empty for a null', async () => {
      const w = {} as Window
      w['foo'] = null

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    it('returns empty for an undefined', async () => {
      const w = {} as Window
      w['foo'] = undefined

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    it('returns result of a function call', async () => {
      const w = {} as Window
      w['foo'] = () => 'bar'

      const actual = await fetcher(w, 'foo()')
      expect(actual).toStrictEqual(['bar'])
    })

    it('returns result object returned from a function call', async () => {
      const w = {} as Window
      w['foo'] = () => ({ foo: 'bar' })

      const actual = await fetcher(w, 'foo().foo')
      expect(actual).toStrictEqual(['bar'])
    })

    it('returns empty for missing property', async () => {
      const w = {} as Window

      const actual = await fetcher(w, 'foo')
      expect(actual).toStrictEqual([])
    })

    it('returns empty if function throws', async () => {
      const w = {} as Window
      w['foo'] = () => {
        throw Error('oops')
      }

      const actual = await fetcher(w, 'foo()')
      expect(actual).toStrictEqual([])
    })

    it('returns result of a function call with a string argument', async () => {
      const w = {} as Window
      w['cache'] = {
        get: (key: string) => ({ name: key }),
      }

      const actual = await fetcher(w, "cache.get('user').name")
      expect(actual).toStrictEqual(['user'])
    })

    it('returns result of a function call with multiple arguments', async () => {
      const w = {} as Window
      w['obj'] = {
        combine: (a: string, b: string) => a + b,
      }

      const actual = await fetcher(w, 'obj.combine("hello", "world")')
      expect(actual).toStrictEqual(['helloworld'])
    })

    it('returns result of a function call with a numeric argument', async () => {
      const w = {} as Window
      w['arr'] = {
        item: (i: number) => `item-${i}`,
      }

      const actual = await fetcher(w, 'arr.item(3)')
      expect(actual).toStrictEqual(['item-3'])
    })

    it('handles the Bespoke CacheManager.get pattern', async () => {
      const w = {} as Window
      w['BP'] = {
        CacheManager: {
          get: (key: string) => {
            if (key === 'current_user') return { email: 'test@example.com' }
            return null
          },
        },
      }

      const actual = await fetcher(w, "window.BP.CacheManager.get('current_user').email")
      expect(actual).toStrictEqual(['test@example.com'])
    })

    it('handles dots inside function arguments without splitting', async () => {
      const w = {} as Window
      w['store'] = {
        get: (key: string) => ({ value: key }),
      }

      const actual = await fetcher(w, "store.get('some.dotted.key').value")
      expect(actual).toStrictEqual(['some.dotted.key'])
    })

    it('backward compat: zero-arg getInstance().options.deviceId', async () => {
      const w = {} as Window
      w['amplitude'] = {
        getInstance: () => ({
          options: { deviceId: 'dev-123' },
        }),
      }

      const actual = await fetcher(w, 'amplitude.getInstance().options.deviceId')
      expect(actual).toStrictEqual(['dev-123'])
    })

    it('returns null when function name resolves to a non-function', async () => {
      const w = {} as Window
      w['obj'] = { notAFn: 'just a string' }

      const actual = await fetcher(w, "obj.notAFn('arg')")
      expect(actual).toStrictEqual([])
    })

    it('parses boolean true argument', async () => {
      const w = {} as Window
      w['obj'] = {
        check: (val: boolean) => (val ? 'yes' : 'no'),
      }

      const actual = await fetcher(w, 'obj.check(true)')
      expect(actual).toStrictEqual(['yes'])
    })

    it('parses boolean false argument', async () => {
      const w = {} as Window
      w['obj'] = {
        check: (val: boolean) => (val ? 'yes' : 'no'),
      }

      const actual = await fetcher(w, 'obj.check(false)')
      expect(actual).toStrictEqual(['no'])
    })

    it('parses null argument', async () => {
      const w = {} as Window
      w['obj'] = {
        describe: (val: any) => (val === null ? 'was-null' : 'not-null'),
      }

      const actual = await fetcher(w, 'obj.describe(null)')
      expect(actual).toStrictEqual(['was-null'])
    })

    it('parses undefined argument', async () => {
      const w = {} as Window
      w['obj'] = {
        describe: (val: any) => (val === undefined ? 'was-undef' : 'not-undef'),
      }

      const actual = await fetcher(w, 'obj.describe(undefined)')
      expect(actual).toStrictEqual(['was-undef'])
    })

    it('passes bare identifier argument as string', async () => {
      const w = {} as Window
      w['obj'] = {
        echo: (val: any) => String(val),
      }

      const actual = await fetcher(w, 'obj.echo(someVar)')
      expect(actual).toStrictEqual(['someVar'])
    })
  })
})
