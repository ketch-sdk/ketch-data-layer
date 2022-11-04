declare global {
  interface Window {
    dataLayer?: any[]
  }
}

export default async function dataLayerFetcher(w: Window, name: string): Promise<any[]> {
  if (!w || !w.dataLayer || name.length === 0) {
    return []
  }

  let out: any[] = []

  for (const dl of w.dataLayer) {
    if (Object.prototype.hasOwnProperty.call(dl, name)) {
      const pv = dl[name]
      if (pv) {
        out = out.concat(pv)
      }
    }
  }

  return out
}
