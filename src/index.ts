import { EventEmitter } from 'events'
import { Identities, Identity, IdentityFormat, IdentityType } from '@ketch-sdk/ketch-types'
import { fetcher as cookieFetcher } from './cookie'
import { fetcher as dataLayerFetcher } from './dataLayer'
import { fetcher as windowFetcher } from './window'
import { fetcher as localStorageFetcher } from './localStorage'
import { fetcher as sessionStorageFetcher } from './sessionStorage'
import { fetcher as queryStringFetcher } from './queryString'
import { fetcher as managedFetcher } from './managed'
import { structure as stringStructure } from './string'
import { structure as jsonStructure } from './json'
import { structure as jwtStructure } from './jwt'
import { structure as queryStructure } from './queryString'
import { structure as semicolonStructure } from './semicolon'
import { ListenerOptions } from './listener'
import { Structure } from './structure'
import deepEqual from 'deep-equal'

/**
 * Watcher provides a mechanism for watching for identities.
 */
export default class Watcher extends EventEmitter {
  private readonly _w: Window
  private readonly _listenerOptions: ListenerOptions
  private _intervalId?: number
  private _fetchers: Map<string, (w: Window) => Promise<string[]>>
  private _identities: Identities

  /**
   * Create a new Watcher.
   *
   * @param w The window interface
   * @param options The listener options
   */
  constructor(w: Window, options?: ListenerOptions) {
    super()
    this._w = w
    this._listenerOptions = options || {}
    this._fetchers = new Map<string, (w: Window) => Promise<string[]>>()
    this._identities = {}
  }

  /**
   * Add an identity with the given name and definition.
   *
   * @param name The name of the identity.
   * @param identity The definition of the identity.
   */
  add(name: string, identity: Identity) {
    let structure: Structure

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
  start() {
    if (this._intervalId) {
      return
    }

    this.notify()

    if (this._listenerOptions.interval) {
      this._intervalId = this._w.setInterval(this.notify, this._listenerOptions.interval)

      if (this._listenerOptions.timeout) {
        this._w.setTimeout(this.stop, this._listenerOptions.timeout)
      }
    }
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
      const values = await fetcher(this._w)

      for (const value of values) {
        identities[key] = value
      }
    }

    if (!deepEqual(identities, this._identities)) {
      this.emit('identity', identities)
      this._identities = identities
    }
  }
}
