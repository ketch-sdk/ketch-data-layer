export default async (w: Window, name: string): Promise<any[]> => {
  if (!w || name.length === 0) {
    return []
  }

  const pv = w.document.cookie?.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')
  if (!pv) {
    return []
  }

  return [pv]
}
