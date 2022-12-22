/**
 * Get a value from a cookie by the key.
 *
 * @param w The window object
 * @param key The cookie key
 */
export function getCookie(w: Window, key: string): string {
  return w.document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === key ? decodeURIComponent(parts[1]) : r
  }, '')
}

/**
 * Set the value against the given key
 *
 * @param w The window object
 * @param key The cookie key
 * @param value The value to set
 * @param ttl The TTL of the cookie value in days
 */
export function setCookie(w: Window, key: string, value: any, ttl?: number): void {
  const days = ttl || 1
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  const hostnameParts = w.document.location.hostname.split('.')

  const details = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=None; Secure`

  // try to set cookie for last i parts of the domain
  // if cookie not found (likely because domain in public suffix list), retry with an additional part on the domain
  for (let i = 2; i <= hostnameParts.length; i++) {
    // set cookie
    w.document.cookie = `${details}; domain=${hostnameParts.slice(-1 * i).join('.')}`

    // return if set, otherwise retry with an additional part on the domain
    if (getCookie(w, key)) {
      return
    }
  }

  // set cookie without domain if hostnameParts.length < 2 or other error
  w.document.cookie = details
}
