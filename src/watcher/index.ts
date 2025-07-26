import { EventEmitter } from 'events'
import { Identity, Traits, Trait, TraitFormat, TraitType, TraitEncoding, TraitName } from '@ketch-sdk/ketch-types'
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
import { encoding as base64Encoding } from '../base64'
import { encoding as noopEncoding } from '../noop'
import { ListenerOptions } from '../listener'
import { Structure } from '../structure'
import { Encoding } from '../encoding'
import deepEqual from 'nano-equal'
import { getLogger } from '@ketch-sdk/ketch-logging'

const log = getLogger('trait')

/**
 * Watcher provides a mechanism for watching for traits.
 */
export default class Watcher {
  private readonly _w: Window
  private readonly _listenerOptions: ListenerOptions
  private _intervalId?: number
  private _fetchers: Map<string, (w: Window) => Promise<string[]>>
  private _attributes: Traits
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
    this._attributes = {}
  }

  /**
   * Add a trait with the given name and definition.
   *
   * @param name The name of the trait.
   * @param attribute The definition of the trait.
   */
  add(name: string, attribute: Identity | Trait | (() => Promise<string[]>)) {
    let structure: Structure
    let encoding: Encoding

    if (typeof attribute === 'function') {
      this._fetchers.set(name, () => attribute())
      return
    }

    switch (attribute.format) {
      case TraitFormat.TRAIT_FORMAT_JSON:
        structure = jsonStructure
        break

      case TraitFormat.TRAIT_FORMAT_JWT:
        structure = jwtStructure
        break

      case TraitFormat.TRAIT_FORMAT_QUERY:
        structure = queryStructure
        break

      case TraitFormat.TRAIT_FORMAT_SEMICOLON:
        structure = semicolonStructure
        break

      default: // string or undefined
        structure = stringStructure
    }

    const key = attribute.key || 'value'

    switch (attribute.encoding) {
      case TraitEncoding.TRAIT_ENCODING_BASE64:
        encoding = base64Encoding
        break

      default: // none or undefined
        encoding = noopEncoding
    }

    switch (attribute.type) {
      case TraitType.TRAIT_TYPE_COOKIE:
        this._fetchers.set(name, (w: Window) =>
          cookieFetcher(w, attribute.variable).then(values =>
            encoding(values)
              .map(structure)
              .map(values => String(values[key])),
          ),
        )
        break

      case TraitType.TRAIT_TYPE_DATA_LAYER:
        this._fetchers.set(name, (w: Window) =>
          dataLayerFetcher(w, attribute.variable).then(values =>
            encoding(values)
              .map(structure)
              .map(values => String(values[key])),
          ),
        )
        break

      case TraitType.TRAIT_TYPE_WINDOW:
        this._fetchers.set(name, (w: Window) =>
          windowFetcher(w, attribute.variable).then(values =>
            encoding(values)
              .map(structure)
              .map(values => String(values[key])),
          ),
        )
        break

      case TraitType.TRAIT_TYPE_LOCAL_STORAGE:
        this._fetchers.set(name, (w: Window) =>
          localStorageFetcher(w, attribute.variable).then(values =>
            encoding(values)
              .map(structure)
              .map(values => String(values[key])),
          ),
        )
        break

      case TraitType.TRAIT_TYPE_SESSION_STORAGE:
        this._fetchers.set(name, (w: Window) =>
          sessionStorageFetcher(w, attribute.variable).then(values =>
            encoding(values)
              .map(structure)
              .map(values => String(values[key])),
          ),
        )
        break

      case TraitType.TRAIT_TYPE_QUERY_STRING:
        this._fetchers.set(name, (w: Window) =>
          queryStringFetcher(w, attribute.variable).then(values =>
            encoding(values)
              .map(structure)
              .map(values => String(values[key])),
          ),
        )
        break

      case TraitType.TRAIT_TYPE_MANAGED:
        this._fetchers.set(name, (w: Window) =>
          managedFetcher(w, attribute.variable).then(values =>
            encoding(values)
              .map(structure)
              .map(values => String(values[key])),
          ),
        )
        break

      default:
        throw new Error(`unsupported trait type ${attribute.type} for ${name}`)
    }
  }

  /**
   * Starts watching for traits.
   */
  async start(type?: TraitName, returnEarly?: boolean) {
    if (this._intervalId) {
      return
    }

    if (this._listenerOptions.interval) {
      this._intervalId = this._w.setInterval(this.notify.bind(this), this._listenerOptions.interval)

      if (this._listenerOptions.timeout) {
        this._w.setTimeout(this.stop.bind(this), this._listenerOptions.timeout)
      }
    }

    return this.notify(type, returnEarly)
  }

  /**
   * Stops watching for traits.
   */
  stop() {
    if (!this._intervalId) {
      return
    }

    this._w.clearInterval(this._intervalId)

    this._intervalId = undefined
  }

  /**
   * Fetches and notifies about traits.
   */
  async notify(type?: TraitName, returnEarly?: boolean): Promise<void> {
    const attributes: Traits = {}

    for (const [key, fetcher] of this._fetchers.entries()) {
      try {
        const values = await fetcher(this._w)

        for (const value of values) {
          attributes[key] = value
        }
      } catch (e) {
        log.warn(`failed to fetch trait for ${key}: ${e}`)
      }
    }

    // If there are new attributes or no attributes at all, emit the event
    // This is to ensure that absent attributes do not hold up the event loop
    // (if it is waiting for attributes object to be fulfilled)
    if (!deepEqual(attributes, this._attributes) || (returnEarly && Object.keys(this._attributes).length === 0)) {
      const message = type || TraitName.IDENTITY
      this._emitter.emit(message, attributes)
      this._attributes = attributes
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
