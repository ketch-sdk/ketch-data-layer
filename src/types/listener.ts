export type Listener = {
  (name: string, value: any): void
}

export type ListenerOptions = {
  timeout?: number
}
