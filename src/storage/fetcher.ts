export default function (storage: string) {
  return async function storageFetcher(w: Window, name: string): Promise<any[]> {
    if (!w || name.length === 0) {
      return []
    }

    try {
      const s: Storage = storage === 'localStorage' ? w.localStorage : w.sessionStorage
      const pv = s.getItem(name)
      if (!pv || pv === '0') {
        return []
      }

      return [pv]
    } catch (e) {
      return []
    }
  }
}
