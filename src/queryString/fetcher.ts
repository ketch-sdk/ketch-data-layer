export default async function queryStringFetcher(w: Window, name: string): Promise<any[]> {
  if (!w || !w.location || w.location.search.length === 0 || name.length === 0) {
    return []
  }

  // Replace + with %2B to preserve + signs when URLSearchParams decodes
  const sanitizedSearch = w.location.search.replace(/\+/g, '%2B')

  return new URLSearchParams(sanitizedSearch).getAll(name).filter(x => x !== '0')
}
