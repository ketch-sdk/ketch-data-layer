import { getCookie, setCookie as sc } from '@ketch-com/ketch-cookie'

/**
 * Set the value against the given key
 *
 * @param w The window object
 * @param key The cookie key
 * @param value The value to set
 * @param ttl The TTL of the cookie value in days
 */
function setCookie(w: Window, key: string, value: any, ttl?: number): void {
  sc(w, key, value, ttl ? ttl * 86400 : ttl)
}

export { getCookie, setCookie }
