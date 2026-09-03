import { fetcher } from './index'
import { NativeBridge } from '../listener'

function makeBridge(overrides: Partial<NativeBridge> = {}): NativeBridge {
  return {
    get: jest.fn().mockResolvedValue(undefined),
    put: jest.fn(),
    ...overrides,
  }
}

describe('nativeMobile', () => {
  describe('fetcher', () => {
    it('returns the value when the bridge has one', async () => {
      const bridge = makeBridge({ get: jest.fn().mockResolvedValue('abc') })
      const actual = await fetcher(window, 'swb_app1', bridge)
      expect(actual).toStrictEqual(['abc'])
      expect(bridge.put).not.toHaveBeenCalled()
    })

    it('returns empty for a non-managed key when the bridge has nothing', async () => {
      const bridge = makeBridge({ get: jest.fn().mockResolvedValue(undefined) })
      const actual = await fetcher(window, 'idfa', bridge)
      expect(actual).toStrictEqual([])
      expect(bridge.put).not.toHaveBeenCalled()
    })

    it('mints and puts a value for the managed identity key when the bridge has nothing', async () => {
      const bridge = makeBridge({ get: jest.fn().mockResolvedValue(undefined) })
      const actual = await fetcher(window, 'swb_app1', bridge)
      expect(bridge.put).toHaveBeenCalledTimes(1)
      const [putKey, putValue] = (bridge.put as jest.Mock).mock.calls[0]
      expect(putKey).toBe('swb_app1')
      expect(actual).toStrictEqual([putValue])
    })

    it('mints for the managed identity key when the bridge times out', async () => {
      jest.useFakeTimers()
      const bridge = makeBridge({ get: jest.fn().mockReturnValue(new Promise(() => {})) })
      const promise = fetcher(window, 'swb_app1', bridge)
      jest.advanceTimersByTime(2000)
      const actual = await promise
      expect(bridge.put).toHaveBeenCalledTimes(1)
      expect(actual).toHaveLength(1)
      jest.useRealTimers()
    })

    it('holds one in-flight promise per key', async () => {
      let resolveGet: (value: string | undefined) => void = () => {}
      const bridge = makeBridge({
        get: jest.fn().mockReturnValue(
          new Promise<string | undefined>(resolve => {
            resolveGet = resolve
          }),
        ),
      })

      const first = fetcher(window, 'swb_app1', bridge)
      const second = fetcher(window, 'swb_app1', bridge)
      resolveGet('abc')

      expect(await first).toStrictEqual(['abc'])
      expect(await second).toStrictEqual(['abc'])
      expect(bridge.get).toHaveBeenCalledTimes(1)
    })

    it('returns empty when no bridge is provided', async () => {
      const actual = await fetcher(window, 'swb_app1', undefined)
      expect(actual).toStrictEqual([])
    })

    it('returns empty for an empty name', async () => {
      const bridge = makeBridge()
      const actual = await fetcher(window, '', bridge)
      expect(actual).toStrictEqual([])
      expect(bridge.get).not.toHaveBeenCalled()
    })
  })
})
