import { notifier } from './index'

describe('storage', () => {
  describe('notifier', () => {
    test('notifies', () => {
      const listener = jest.fn()

      let eventHandler: (arg0: StorageEvent) => void = jest.fn()

      const w = {
        addEventListener(eventName: string, callback: (arg0: StorageEvent) => void) {
          if (eventName === 'storage') {
            eventHandler = callback
          }
        },
      } as Window

      notifier(w, 'foo', listener)

      if (eventHandler) {
        eventHandler({
          key: 'foo',
          oldValue: null,
          newValue: 'bar',
        } as StorageEvent)

        eventHandler({
          key: 'foo',
          oldValue: 'bar',
          newValue: 'bar1',
        } as StorageEvent)

        eventHandler({
          key: 'foo',
          oldValue: 'bar1',
          newValue: 'bar2',
        } as StorageEvent)
      }

      expect(listener).toHaveBeenCalledTimes(3)
    })
  })
})
