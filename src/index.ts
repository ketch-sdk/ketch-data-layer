import { fetcher as cookieFetcher, getCookie, setCookie } from './cookie'
import { fetcher as dataLayerFetcher } from './dataLayer'
import { fetcher as windowFetcher } from './window'
import { fetcher as localStorageFetcher } from './localStorage'
import { fetcher as sessionStorageFetcher } from './sessionStorage'
import { fetcher as queryStringFetcher } from './queryString'
import { fetcher as managedFetcher } from './managed'
import { structure as stringStructure } from './string'
import { structure as jsonStructure } from './json'
import { structure as jwtStructure } from './jwt'
import { structure as queryStructure } from './queryString'
import { structure as semicolonStructure } from './semicolon'
import Watcher from './watcher'

export {
  cookieFetcher,
  getCookie,
  setCookie,
  dataLayerFetcher,
  windowFetcher,
  localStorageFetcher,
  sessionStorageFetcher,
  queryStringFetcher,
  managedFetcher,
  stringStructure,
  jsonStructure,
  jwtStructure,
  queryStructure,
  semicolonStructure,
}

export default Watcher
