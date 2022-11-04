export default async function windowFetcher(w: Window, name: string): Promise<any[]> {
  if (!w || name.length === 0) {
    return []
  }

  try {
    const pv = getProperty(w, name)
    if (!pv) {
      return []
    }

    return [pv]
  } catch (e) {
    return []
  }
}

function getProperty(w: Window, p: string): string | null {
  const parts: string[] = p.split('.')
  let context: any = w
  let previousContext: any = null

  while (parts.length > 0) {
    if (parts[0] === 'window') {
      parts.shift()
    } else if (typeof context === 'object') {
      if (parts[0].slice(-2) === '()') {
        previousContext = context
        context = context[(parts[0] as string).slice(0, -2)]
      } else {
        previousContext = context
        context = context[parts.shift() as string]
      }
    } else if (typeof context === 'function') {
      const newContext = context.call(previousContext)
      previousContext = context
      context = newContext
      parts.shift()
    } else {
      return null
    }
  }

  if (context && typeof context !== 'string') {
    context = context.toString()
  }

  return context
}
