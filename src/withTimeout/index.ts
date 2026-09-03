/**
 * Races a promise against a timeout. If the timeout wins, resolves to `undefined`
 * rather than rejecting — callers treat "no answer in time" the same as "no answer".
 */
export default function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | undefined> {
  return new Promise<T | undefined>(resolve => {
    let settled = false
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true
        resolve(undefined)
      }
    }, ms)

    promise.then(
      value => {
        if (!settled) {
          settled = true
          clearTimeout(timer)
          resolve(value)
        }
      },
      () => {
        if (!settled) {
          settled = true
          clearTimeout(timer)
          resolve(undefined)
        }
      },
    )
  })
}
