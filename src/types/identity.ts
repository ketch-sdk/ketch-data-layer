export type IdentityLocationType = 'cookie' | 'dataLayer' | 'global' | 'localStorage' | 'queryString'

export type IdentityLocation = {
  type: IdentityLocationType
  name: string
}

export type IdentityDefinition = {
  name: string
  location: IdentityLocation
}
