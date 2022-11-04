export default async function queryStringFetcher(w: Window, name: string): Promise<any[]> {
  if (!w || !w.location || w.location.search.length === 0 || name.length === 0) {
    return []
  }

  return new URLSearchParams(w.location.search).getAll(name)
}
