import { Listener, ListenerOptions } from '../types/listener'
import fetch from './fetcher'

const DEFAULT_TIMEOUT = 2000

export default async (w: Window, name: string, listener: Listener, options?: ListenerOptions): Promise<void> => {
  w.setInterval(
    () => fetch(w, name).then(values => values.forEach(v => listener(name, v))),
    options?.timeout || DEFAULT_TIMEOUT,
  )
}
