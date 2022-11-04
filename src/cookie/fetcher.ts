import { getCookie } from './util'

export default async function cookieFetcher(w: Window, name: string): Promise<any[]> {
  if (!w || name.length === 0) {
    return []
  }

  const pv = getCookie(w, name)
  if (!pv || pv === '0') {
    return []
  }

  return [pv]
}
