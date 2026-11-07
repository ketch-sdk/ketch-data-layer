import Emitter from './emitter'

describe('Emitter', () => {
  it('calls listeners in registration order with the emitted arguments', () => {
    const emitter = new Emitter()
    const calls: string[] = []
    emitter.on('ev', (a: string) => calls.push(`first:${a}`))
    emitter.addListener('ev', (a: string) => calls.push(`second:${a}`))

    expect(emitter.emit('ev', 'x')).toBe(true)
    expect(calls).toEqual(['first:x', 'second:x'])
  })

  it('returns false from emit when the event has no listeners', () => {
    const emitter = new Emitter()
    expect(emitter.emit('nothing')).toBe(false)
  })

  it('invokes listeners with this bound to the emitter', () => {
    const emitter = new Emitter()
    let self: unknown
    emitter.on('ev', function (this: unknown) {
      self = this
    })
    emitter.emit('ev')
    expect(self).toBe(emitter)
  })

  it('calls a duplicate registration once per registration', () => {
    const emitter = new Emitter()
    const listener = jest.fn()
    emitter.on('ev', listener).on('ev', listener)
    emitter.emit('ev')
    expect(listener).toHaveBeenCalledTimes(2)
    expect(emitter.listenerCount('ev')).toBe(2)
  })

  it('removes a once listener before invoking it', () => {
    const emitter = new Emitter()
    const counts: number[] = []
    emitter.once('ev', () => {
      counts.push(emitter.listenerCount('ev'))
      // Re-emitting from inside the listener must not call it again
      emitter.emit('ev')
    })
    expect(emitter.listenerCount('ev')).toBe(1)
    emitter.emit('ev')
    emitter.emit('ev')
    expect(counts).toEqual([0])
  })

  it('removes a once listener by the original function', () => {
    const emitter = new Emitter()
    const listener = jest.fn()
    emitter.once('ev', listener)
    emitter.removeListener('ev', listener)
    emitter.emit('ev')
    expect(listener).not.toHaveBeenCalled()
    expect(emitter.listenerCount('ev')).toBe(0)
  })

  it('removes the most recent matching registration', () => {
    const emitter = new Emitter()
    const calls: string[] = []
    const shared = () => calls.push('shared')
    const other = () => calls.push('other')
    emitter.on('ev', shared).on('ev', other).on('ev', shared)
    emitter.off('ev', shared)
    emitter.emit('ev')
    expect(calls).toEqual(['shared', 'other'])
  })

  it('ignores removal of a listener that is not registered', () => {
    const emitter = new Emitter()
    const registered = jest.fn()
    const missing = jest.fn()
    expect(emitter.removeListener('unknown', missing)).toBe(emitter)
    emitter.on('ev', registered)
    emitter.removeListener('ev', missing)
    emitter.emit('ev')
    expect(registered).toHaveBeenCalledTimes(1)
  })

  it('dispatches to a snapshot of the listeners', () => {
    const emitter = new Emitter()
    const late = jest.fn()
    const removed = jest.fn()
    emitter.on('ev', () => {
      emitter.on('ev', late)
      emitter.off('ev', removed)
    })
    emitter.on('ev', removed)
    emitter.emit('ev')
    expect(late).not.toHaveBeenCalled()
    expect(removed).toHaveBeenCalledTimes(1)
    emitter.emit('ev')
    expect(late).toHaveBeenCalledTimes(1)
    expect(removed).toHaveBeenCalledTimes(1)
  })

  it('removes all listeners for one event or for every event', () => {
    const emitter = new Emitter()
    const a = jest.fn()
    const b = jest.fn()
    emitter.on('a', a).on('b', b)
    emitter.removeAllListeners('a')
    emitter.emit('a')
    emitter.emit('b')
    expect(a).not.toHaveBeenCalled()
    expect(b).toHaveBeenCalledTimes(1)

    emitter.removeAllListeners()
    expect(emitter.emit('b')).toBe(false)
    expect(emitter.listenerCount('b')).toBe(0)
  })

  it('accepts symbol event names', () => {
    const emitter = new Emitter()
    const name = Symbol('ev')
    const listener = jest.fn()
    emitter.on(name, listener)
    emitter.emit(name, 1, 2)
    expect(listener).toHaveBeenCalledWith(1, 2)
  })

  it('stores the max listener count without enforcing it', () => {
    const emitter = new Emitter()
    expect(emitter.getMaxListeners()).toBe(10)
    expect(emitter.setMaxListeners(1)).toBe(emitter)
    expect(emitter.getMaxListeners()).toBe(1)
    const listener = jest.fn()
    emitter.on('ev', listener).on('ev', listener)
    emitter.emit('ev')
    expect(listener).toHaveBeenCalledTimes(2)
  })
})
