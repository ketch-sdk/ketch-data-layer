import { getCookie, setCookie } from '@ketch-com/ketch-cookie'
import { v4 as uuidv4 } from 'uuid'

const MANAGED_IDENTITY_TTL = 730 * 86400

export default async function managedFetcher(w: Window, name: string): Promise<any[]> {
  if (!w || name.length === 0) {
    return []
  }

  name = '_swb'

  let pv = getCookie(w, name)
  if (pv) {
    return [pv]
  }

  setCookie(w, name, uuidv4(), MANAGED_IDENTITY_TTL)

  pv = getCookie(w, name)
  if (pv) {
    return [pv]
  }

  return []
}
