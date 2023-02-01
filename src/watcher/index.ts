import { EventEmitter } from 'events'
import { Identities, Identity, IdentityFormat, IdentityType } from '@ketch-sdk/ketch-types'
import { fetcher as cookieFetcher } from '../cookie'
import { fetcher as dataLayerFetcher } from '../dataLayer'
import { fetcher as windowFetcher } from '../window'
import { fetcher as localStorageFetcher } from '../localStorage'
import { fetcher as sessionStorageFetcher } from '../sessionStorage'
import { fetcher as queryStringFetcher } from '../queryString'
import { fetcher as managedFetcher } from '../managed'
import { structure as stringStructure } from '../string'
import { structure as jsonStructure } from '../json'
import { structure as jwtStructure } from '../jwt'
import { structure as queryStructure } from '../queryString'
import { structure as semicolonStructure } from '../semicolon'
import { ListenerOptions } from '../listener'
import { Structure } from '../structure'
import deepEqual from 'nano-equal'
import { getLogger } from '@ketch-sdk/ketch-logging'

const log = getLogger('identity')

/**
 * Watcher provides a mechanism for watching for identities.
 */
export default class Watcher {
  private readonly _w: Window
  private readonly _listenerOptions: ListenerOptions
  private _intervalId?: number
  private _fetchers: Map<string, (w: Window) => Promise<string[]>>
  private _identities: Identities
  private _emitter: EventEmitter

  /**
   * Create a new Watcher.
   *
   * @param w The window interface
   * @param options The listener options
   */
  constructor(w: Window, options: ListenerOptions = {}) {
    this._emitter = new EventEmitter()
    this._w = w
    this._listenerOptions = options
    this._fetchers = new Map<string, (w: Window) => Promise<string[]>>()
    this._identities = {}
  }

  /**
   * Add an identity with the given name and definition.
   *
   * @param name The name of the identity.
   * @param identity The definition of the identity.
   */
  add(name: string, identity: Identity | (() => Promise<string[]>)) {
    let structure: Structure

    if (typeof identity === 'function') {
      this._fetchers.set(name, () => identity())
      return
    }

    switch (identity.format) {
      case IdentityFormat.IDENTITY_FORMAT_JSON:
        structure = jsonStructure
        break

      case IdentityFormat.IDENTITY_FORMAT_JWT:
        structure = jwtStructure
        break

      case IdentityFormat.IDENTITY_FORMAT_QUERY:
        structure = queryStructure
        break

      case IdentityFormat.IDENTITY_FORMAT_SEMICOLON:
        structure = semicolonStructure
        break

      default: // string or undefined
        structure = stringStructure
    }

    const key = identity.key || 'value'

    switch (identity.type) {
      case IdentityType.IDENTITY_TYPE_COOKIE:
        this._fetchers.set(name, (w: Window) =>
          cookieFetcher(w, identity.variable).then(values => values.map(structure).map(values => values[key])),
        )
        break

      case IdentityType.IDENTITY_TYPE_DATA_LAYER:
        this._fetchers.set(name, (w: Window) =>
          dataLayerFetcher(w, identity.variable).then(values => values.map(structure).map(values => values[key])),
        )
        break

      case IdentityType.IDENTITY_TYPE_WINDOW:
        this._fetchers.set(name, (w: Window) =>
          windowFetcher(w, identity.variable).then(values => values.map(structure).map(values => values[key])),
        )
        break

      case IdentityType.IDENTITY_TYPE_LOCAL_STORAGE:
        this._fetchers.set(name, (w: Window) =>
          localStorageFetcher(w, identity.variable).then(values => values.map(structure).map(values => values[key])),
        )
        break

      case IdentityType.IDENTITY_TYPE_SESSION_STORAGE:
        this._fetchers.set(name, (w: Window) =>
          sessionStorageFetcher(w, identity.variable).then(values => values.map(structure).map(values => values[key])),
        )
        break

      case IdentityType.IDENTITY_TYPE_QUERY_STRING:
        this._fetchers.set(name, (w: Window) =>
          queryStringFetcher(w, identity.variable).then(values => values.map(structure).map(values => values[key])),
        )
        break

      case IdentityType.IDENTITY_TYPE_MANAGED:
        this._fetchers.set(name, (w: Window) =>
          managedFetcher(w, identity.variable).then(values => values.map(structure).map(values => values[key])),
        )
        break

      default:
        throw new Error(`unsupported identity type ${identity.type} for ${name}`)
    }
  }

  /**
   * Starts watching for identities.
   */
  async start() {
    if (this._intervalId) {
      return
    }

    if (this._listenerOptions.interval) {
      this._intervalId = this._w.setInterval(this.notify.bind(this), this._listenerOptions.interval)

      if (this._listenerOptions.timeout) {
        this._w.setTimeout(this.stop.bind(this), this._listenerOptions.timeout)
      }
    }

    return this.notify()
  }

  /**
   * Stops watching for identities.
   */
  stop() {
    if (!this._intervalId) {
      return
    }

    this._w.clearInterval(this._intervalId)

    this._intervalId = undefined
  }

  /**
   * Fetches and notifies about identities.
   */
  async notify(): Promise<void> {
    const identities: Identities = {}

    for (const [key, fetcher] of this._fetchers.entries()) {
      try {
        const values = await fetcher(this._w)

        for (const value of values) {
          identities[key] = value
        }
      } catch (e) {
        log.warn(`failed to fetch identity for ${key}: ${e}`)
      }
    }

    if (!deepEqual(identities, this._identities)) {
      this._emitter.emit('identity', identities)
      this._identities = identities
    }
  }

  /**
   * Alias for `emitter.on(eventName, listener)`.
   */
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return this.on(eventName, listener)
  }

  /**
   * Adds the `listener` function to the end of the listeners array for the
   * event named `eventName`. No checks are made to see if the `listener` has
   * already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in
   * the `listener` being added, and called, multiple
   * times.
   *
   * @param eventName The name of the event.
   * @param listener The callback function
   */
  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    this._emitter.on(eventName, listener)
    return this
  }

  /**
   * Adds a **one-time**`listener` function for the event named `eventName`. The
   * next time `eventName` is triggered, this listener is removed and then invoked.
   *
   * @param eventName The name of the event.
   * @param listener The callback function
   */
  once(eventName: string | symbol, listener: (...args: any[]) => void): this {
    this._emitter.once(eventName, listener)
    return this
  }

  /**
   * Removes the specified `listener` from the listener array for the event named`eventName`.
   */
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return this.off(eventName, listener)
  }

  /**
   * Alias for `emitter.removeListener()`.
   */
  off(eventName: string | symbol, listener: (...args: any[]) => void): this {
    this._emitter.off(eventName, listener)
    return this
  }

  /**
   * Removes all listeners, or those of the specified `eventName`.
   *
   * It is bad practice to remove listeners added elsewhere in the code,
   * particularly when the `EventEmitter` instance was created by some other
   * component or module (e.g. sockets or file streams).
   *
   * Returns a reference to the `EventEmitter`, so that calls can be chained.
   */
  removeAllListeners(event?: string | symbol): this {
    this._emitter.removeAllListeners(event)
    return this
  }
}
