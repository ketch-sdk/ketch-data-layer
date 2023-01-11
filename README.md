# ketch-data-layer

The `ketch-data-layer` library implements a [Watcher](#Watcher) and a set of [Fetcher](#Fetcher) and [Structure](#Structure)
implementations for fetching and structuring identities.

The following [Fetchers](#Fetcher) are implemented:
* cookie
* dataLayer
* localStorage
* managed
* queryString
* sessionStorage
* window

The following [Structures](#Structure) are implemented:
* json
* jwt
* queryString
* semicolon
* string

## Identity

An Identity can be described using the following interface:

```typescript
export interface Identity {
  /**
   * type is the location on the page from which to retrieve identity information
   */
  type: IdentityType;

  /**
   * variable is the name to look up the identity value in the specified location
   */
  variable: string;

  /**
   * format is the encoding of the value
   */
  format: IdentityFormat;

  /**
   * key is the identifier to find the identity within the value if the format is IDENTITY_FORMAT_STRING
   * then key will be undefined
   */
  key?: string;

  /**
   * priority of the identity for consent conflict resolution
   */
  priority?: number;
}
```

Priority is ignored by this library.

## Watcher

The primary class is the `Watcher` which contains a series of registered identities that it watches for changes to.

### Creating a Watcher

```typescript
const w = new Watcher(window, {interval, timeout})
```

Creates a new `Watcher` attached to the given `window`. The watcher will poll every `interval` until `timeout` seconds.

### Add an identity

```typescript
const name: string = ''
const identity: Identity | (() => Promise<string[]> = {}
w.add(name, identity)
```

Registers an identity with the given `name` using the provided `identity` configuration. There are two
types of configuration allowed.  The first type is an instance of an `Identity` object. If given this,
the watcher selects from it's know library based on the specification in the `Identity`. The second option,
which is a function returning a Promise of string values, can be used if the required identity cannot be
described using `Identity`.

### Start watching

```typescript
await w.start()
```

Starts the [Watcher](#Watcher) watching based on the `interval` and `timeout` provided in the constructor.

### Stop watching

```typescript
w.stop()
```

Stops the [Watcher](#Watcher).

### Immediately notifying

```typescript
await w.notify()
```

Immediately fetches and notifies about identities by emitting an `identities` event.

### Add a listener

```typescript
const listener: (...args: any[]) => void = () => {}
w.addListener('identities', listener)
w.on('identities', listener)
```

Add a listener function that gets called each time identities change. The argument to the listener
will be an `Identities` map.

### Add a one-time listener

```typescript
const listener: (...args: any[]) => void = () => {}
w.once('identities', listener)
```

Adds a one-time listener function. The argument to the listener
will be an `Identities` map.

### Remove a listener

```typescript
const listener: (...args: any[]) => void = () => {}
w.removeListener('identities', listener)
w.off('identities', listener)
```

Removes the given listener.

### Remove all listeners

```typescript
w.removeAllListeners('identities')
```

Removes all listeners.

## Fetcher

A `Fetcher` is a function with the following signature:

```typescript
type Fetcher = async (w: Window, name: string) => Promise<any[]>
```

The `w` parameter is the `Window` to attach to. The `name` is the name of the identity. The return
must be an array of discovered, structured identities. The structured identities will be destructured
using a [Structure](#Structure) function to provide the identity value.

## Structure

A `Structure` is a function with the following signature:

```typescript
type Mapper = {
  [key: string]: string
}

type Structure = (value: any) => Mapper
```

Given some structured value, the job of the `Structure` function is to return a key-value map representing the
values in that structure. If there is only a single identifiable value, then the key should be `value`.

## Cookie

This library also exposes some utility functions that may be useful outside of the library's core purpose.

### getCookie

```typescript
import { getCookie } from '@ketch-sdk/ketch-data-layer/cookie'

const name: string = ''
const value = getCookie(window, name)
```

Retrieves the full raw value of the cookie with the given name.

### setCookie

```typescript
import { setCookie } from '@ketch-sdk/ketch-data-layer/cookie'

const name: string = ''
const value: any = ''
const ttl: number = 2 // 2 days
setCookie(window, name, value, ttl)
```

Sets the value of the cookie with the given name. The TTL of the cookie is set to `ttl` days. Note that
long-lasting cookies are subject to [Intelligent Tracking Prevention](https://webkit.org/tracking-prevention-policy/) limitations.
