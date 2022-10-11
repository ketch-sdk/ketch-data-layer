declare global {
  interface Window {
    dataLayer?: any[]
  }
}

export default async (w: Window, name: string): Promise<any[]> => {
  if (!w || name.length === 0) {
    return []
  }

  if (!w.dataLayer) {
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
