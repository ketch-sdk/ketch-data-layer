import { v4 as uuidv4 } from 'uuid'
import withTimeout from '../withTimeout'

const NATIVE_BRIDGE_TIMEOUT_MS = 2000

export type NativeBridge = {
  get: (key: string) => Promise<string | undefined>
  put: (key: string, value: string) => void
}

// One in-flight promise per key, so a slow poll can't start (and mint) a second
// time before the first one lands.
const inFlight = new Map<string, Promise<any[]>>()

async function getOrMint(name: string, bridge: NativeBridge): Promise<any[]> {
  const pv = await withTimeout(bridge.get(name), NATIVE_BRIDGE_TIMEOUT_MS)
  if (pv) {
    return [pv]
  }

  // A missing ad ID is legitimate; only the managed identity mints on empty.
  if (!name.startsWith('swb_')) {
    return []
  }

  const minted = uuidv4()
  bridge.put(name, minted)
  return [minted]
}

export default async function nativeMobileFetcher(
  w: Window,
  name: string,
  bridge?: NativeBridge,
): Promise<any[]> {
  if (!w || name.length === 0 || !bridge) {
    return []
  }

  const cached = inFlight.get(name)
  if (cached) {
    return cached
  }

  const promise = getOrMint(name, bridge).finally(() => inFlight.delete(name))
  inFlight.set(name, promise)
  return promise
}
