import { Listener, ListenerOptions } from '../listener'

export default (w: Window, name: string, listener: Listener, _options?: ListenerOptions): void => {
  w.addEventListener('storage', event => {
    if (event.key === name) {
      listener(name, event.newValue)
    }
  })
}
