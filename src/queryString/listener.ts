import { Listener, ListenerOptions } from '../types/listener'
import queryString from './fetcher'

export default async (w: Window, name: string, listener: Listener, _options?: ListenerOptions): Promise<void> => {
  const values = await queryString(w, name)
  values.forEach(v => listener(name, v))
}
