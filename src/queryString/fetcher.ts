export default async (w: Window, name: string): Promise<any[]> => {
  if (!w || !w.location || w.location.search.length === 0 || name.length === 0) {
    return []
  }

  const pv = new URLSearchParams(w.location.search).getAll(name)
  if (!pv) {
    return []
  }

  return pv
}
