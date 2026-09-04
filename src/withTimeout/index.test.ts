import withTimeout from './index'

describe('withTimeout', () => {
  it('resolves with the value when the promise settles before the timeout', async () => {
    const actual = await withTimeout(Promise.resolve('abc'), 1000)
    expect(actual).toBe('abc')
  })

  it('resolves to undefined when the promise rejects', async () => {
    const actual = await withTimeout(Promise.reject(new Error('boom')), 1000)
    expect(actual).toBeUndefined()
  })

  it('resolves to undefined when the timeout wins', async () => {
    jest.useFakeTimers()
    const promise = withTimeout(new Promise(() => {}), 1000)
    jest.advanceTimersByTime(1000)
    const actual = await promise
    expect(actual).toBeUndefined()
    jest.useRealTimers()
  })
})
