export default async function windowFetcher(w: Window, name: string): Promise<any[]> {
  if (!w || name.length === 0) {
    return []
  }

  try {
    const pv = getProperty(w, name)
    if (!pv || pv === '0') {
      return []
    }

    return [pv]
  } catch (e) {
    return []
  }
}

function splitPath(p: string): string[] {
  const parts: string[] = []
  let current = ''
  let parenDepth = 0

  for (const ch of p) {
    if (ch === '(') parenDepth++
    if (ch === ')') parenDepth--
    if (ch === '.' && parenDepth === 0) {
      parts.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  if (current) parts.push(current)
  return parts
}

function parseFunctionCall(part: string): { name: string; args: any[] } | null {
  const match = part.match(/^(\w+)\((.*)\)$/)
  if (!match) return null
  const name = match[1]
  const rawArgs = match[2].trim()
  if (rawArgs === '') return { name, args: [] }
  const args = rawArgs.split(',').map(arg => {
    arg = arg.trim()
    if ((arg.startsWith("'") && arg.endsWith("'")) || (arg.startsWith('"') && arg.endsWith('"'))) {
      return arg.slice(1, -1)
    }
    const num = Number(arg)
    if (!isNaN(num)) return num
    if (arg === 'true') return true
    if (arg === 'false') return false
    if (arg === 'null') return null
    if (arg === 'undefined') return undefined
    return arg
  })
  return { name, args }
}

function getProperty(w: Window, p: string): string | null {
  const parts: string[] = splitPath(p)
  let context: any = w
  let previousContext: any = null

  while (parts.length > 0) {
    if (parts[0] === 'window') {
      parts.shift()
    } else if (typeof context === 'object') {
      const call = parseFunctionCall(parts[0])
      if (call) {
        previousContext = context
        const fn = context[call.name]
        if (typeof fn === 'function') {
          context = fn.apply(previousContext, call.args)
        } else {
          return null
        }
        parts.shift()
      } else {
        previousContext = context
        context = context[parts.shift() as string]
      }
    } else {
      return null
    }
  }

  if (context && typeof context !== 'string') {
    context = context.toString()
    if (context.startsWith('[object')) {
      return ''
    }
  }

  return context
}
