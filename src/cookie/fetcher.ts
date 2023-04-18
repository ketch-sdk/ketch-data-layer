import { getCookie } from './util'
import queryStringFetcher from '../queryString/fetcher'

export default async function cookieFetcher(w: Window, name: string): Promise<any[]> {
  if (!w || name.length === 0) {
    return []
  }

  const pv = getCookie(w, name)
  if (!pv || pv === '0') {
    return queryStringFetcher(w, `ketch_${name}`)
  }

  return [pv]
}
