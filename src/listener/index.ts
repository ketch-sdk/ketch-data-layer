/**
 * ListenerOptions provide an interval and timeout for listening.
 */
export declare type ListenerOptions = {
  interval?: number
  timeout?: number
  /** TTL in seconds for the managed identity cookie (_swb) when the fetcher creates it */
  managedCookieTtl?: number
  /** Bridge to the native mobile SDK's storage, used by nativeMobileFetcher instead of a cookie */
  nativeBridge?: {
    get: (key: string) => Promise<string | undefined>
    put: (key: string, value: string) => void
  }
}
