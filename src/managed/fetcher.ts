import { getCookie, setCookie } from '../cookie'

const MANAGED_IDENTITY_TTL = 730

export default async function managedFetcher(w: Window, name: string): Promise<any[]> {
  if (!w || name.length === 0) {
    return []
  }

  name = '_swb'

  let pv = getCookie(w, name)
  if (pv) {
    return [pv]
  }

  setCookie(w, name, '', MANAGED_IDENTITY_TTL)

  pv = getCookie(w, name)
  if (pv) {
    return [pv]
  }

  return []
}
