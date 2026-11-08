/**
 * A listener registered on an {@link Emitter}.
 */
export type Listener = (...args: any[]) => void

/**
 * A registered listener. Wrappers created by `once` carry the original
 * function in `listener` so `removeListener` can match them by it.
 */
type Registered = Listener & { listener?: Listener }

const DEFAULT_MAX_LISTENERS = 10

/**
 * Emitter is a small event emitter with the observable semantics of Node's
 * `EventEmitter` that the data layer relies on, so the browser bundle does not
 * carry the `events` polyfill.
 */
export default class Emitter {
  private readonly _listeners = new Map<string | symbol, Registered[]>()
  private _maxListeners = DEFAULT_MAX_LISTENERS

  /**
   * Alias for `on(eventName, listener)`.
   */
  addListener(eventName: string | symbol, listener: Listener): this {
    return this.on(eventName, listener)
  }

  /**
   * Adds `listener` to the end of the listeners array for `eventName`.
   * No check is made for duplicates: registering the same listener twice
   * calls it twice.
   */
  on(eventName: string | symbol, listener: Listener): this {
    const list = this._listeners.get(eventName)
    if (list) {
      list.push(listener)
    } else {
      this._listeners.set(eventName, [listener])
    }
    return this
  }

  /**
   * Adds a one-time `listener` for `eventName`. The next time the event is
   * emitted the listener is removed and then invoked.
   */
  once(eventName: string | symbol, listener: Listener): this {
    const wrapper: Registered = (...args: any[]) => {
      // Remove before invoking so a listener that emits the same event
      // from inside its body does not run a second time.
      this.removeListener(eventName, wrapper)
      listener.apply(this, args)
    }
    wrapper.listener = listener
    return this.on(eventName, wrapper)
  }

  /**
   * Removes the most recently registered `listener` for `eventName`.
   * A listener registered with `once` can be removed by the original function.
   */
  removeListener(eventName: string | symbol, listener: Listener): this {
    const list = this._listeners.get(eventName)
    if (!list) {
      return this
    }
    // Search from the end so the last matching registration is the one removed.
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        list.splice(i, 1)
        break
      }
    }
    if (list.length === 0) {
      this._listeners.delete(eventName)
    }
    return this
  }

  /**
   * Alias for `removeListener(eventName, listener)`.
   */
  off(eventName: string | symbol, listener: Listener): this {
    return this.removeListener(eventName, listener)
  }

  /**
   * Removes all listeners, or those of the specified `eventName`.
   */
  removeAllListeners(eventName?: string | symbol): this {
    if (eventName === undefined) {
      this._listeners.clear()
    } else {
      this._listeners.delete(eventName)
    }
    return this
  }

  /**
   * Synchronously calls each listener registered for `eventName`, in
   * registration order, with `this` bound to the emitter.
   *
   * @returns `true` if the event had listeners, `false` otherwise.
   */
  emit(eventName: string | symbol, ...args: any[]): boolean {
    const list = this._listeners.get(eventName)
    if (!list) {
      return false
    }
    // Iterate over a copy so listeners added or removed during dispatch
    // do not affect this round.
    for (const listener of list.slice()) {
      listener.apply(this, args)
    }
    return true
  }

  /**
   * Returns the number of listeners for `eventName`, counting `once`
   * registrations that have not fired yet.
   */
  listenerCount(eventName: string | symbol): number {
    return this._listeners.get(eventName)?.length ?? 0
  }

  /**
   * Stores the listener limit for API compatibility with Node's `EventEmitter`.
   * No warning is emitted when it is exceeded.
   */
  setMaxListeners(n: number): this {
    this._maxListeners = n
    return this
  }

  /**
   * Returns the value set by `setMaxListeners`, or the default of 10.
   */
  getMaxListeners(): number {
    return this._maxListeners
  }
}
