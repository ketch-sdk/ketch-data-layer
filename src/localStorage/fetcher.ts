export default async (w: Window, name: string): Promise<any[]> => {
  if (!w || name.length === 0) {
    return []
  }

  const pv = w.localStorage.getItem(name)
  if (!pv) {
    return []
  }

  return [pv]
}
