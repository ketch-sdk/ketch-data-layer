import { Listener, ListenerOptions } from '../types/listener'

export default async (w: Window, name: string, listener: Listener, _options?: ListenerOptions): Promise<void> => {
  w.addEventListener('storage', event => {
    if (event.key === name) {
      listener(name, event.newValue)
    }
  })
}
