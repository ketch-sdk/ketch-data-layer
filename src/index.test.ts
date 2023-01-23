import Watcher from './index'
import { IdentityFormat, IdentityType } from '@ketch-sdk/ketch-types'
jest.mock('uuid', () => ({ v4: () => '123456789' }))

describe('watcher', () => {
  test('starts', done => {
    const watcher = new Watcher(window, {
      interval: 500,
      timeout: 3000,
    })

    const w = window as any
    w['foo_win'] = 'bar_win'
    w['foo_win_qs'] = 'bar1=val1;bar2=val2'
    window.document.cookie = 'foo_cook=bar_cook'
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ foo_dl: 'bar_dl1=val_dl&bar_dl2=val_dl2' })
    window.localStorage.setItem('foo_ls', JSON.stringify({ value: 'bar_ls' }))
    window.sessionStorage.setItem(
      'foo_ss',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwi' +
        'aWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    )
    // window.location.search = 'foo_qs=bar_qs' - this has to be setup in jest.config.js

    watcher.add('foo_win_idsp', {
      type: IdentityType.IDENTITY_TYPE_WINDOW,
      format: IdentityFormat.IDENTITY_FORMAT_STRING,
      variable: 'window.foo_win',
    })
    watcher.add('foo_win_idsp_qs', {
      type: IdentityType.IDENTITY_TYPE_WINDOW,
      format: IdentityFormat.IDENTITY_FORMAT_SEMICOLON,
      variable: 'window.foo_win_qs',
      key: 'bar2',
    })
    watcher.add('foo_cook_idsp', {
      type: IdentityType.IDENTITY_TYPE_COOKIE,
      format: IdentityFormat.IDENTITY_FORMAT_STRING,
      variable: 'foo_cook',
    })
    watcher.add('foo_dl_idsp', {
      type: IdentityType.IDENTITY_TYPE_DATA_LAYER,
      format: IdentityFormat.IDENTITY_FORMAT_QUERY,
      variable: 'foo_dl',
      key: 'bar_dl2',
    })
    watcher.add('foo_qs_idsp', {
      type: IdentityType.IDENTITY_TYPE_QUERY_STRING,
      format: IdentityFormat.IDENTITY_FORMAT_STRING,
      variable: 'foo_qs',
    })
    watcher.add('foo_ls_idsp', {
      type: IdentityType.IDENTITY_TYPE_LOCAL_STORAGE,
      format: IdentityFormat.IDENTITY_FORMAT_JSON,
      variable: 'foo_ls',
      key: 'value',
    })
    watcher.add('foo_ss_idsp', {
      type: IdentityType.IDENTITY_TYPE_SESSION_STORAGE,
      format: IdentityFormat.IDENTITY_FORMAT_JWT,
      variable: 'foo_ss',
      key: 'name',
    })
    watcher.add('foo_managed_idsp', {
      type: IdentityType.IDENTITY_TYPE_MANAGED,
      format: IdentityFormat.IDENTITY_FORMAT_STRING,
      variable: 'foo_managed',
    })
    watcher.add('foo_provider', () => Promise.resolve(['bar_provider']))
    watcher.add('bad_provider', () => Promise.reject('expected to throw'))
    const listener = jest.fn().mockName('listener') // .mockImplementation(console.log)
    const onceListener = jest.fn().mockName('listener') // .mockImplementation(console.log)
    watcher.addListener('identity', listener)
    watcher.once('identity', onceListener)
    watcher.start()
    watcher.start()
    watcher.notify()
    w['foo_win'] = 'bar_win2'
    watcher.notify()
    watcher.notify()
    watcher.notify()
    watcher.stop()
    watcher.stop()

    setTimeout(() => {
      watcher.removeListener('identity', listener)
      watcher.removeAllListeners('identity')
      expect(onceListener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledTimes(2)
      expect(listener).toHaveBeenNthCalledWith(1, {
        foo_win_idsp: 'bar_win',
        foo_cook_idsp: 'bar_cook',
        foo_dl_idsp: 'val_dl2',
        foo_qs_idsp: 'bar_qs',
        foo_ls_idsp: 'bar_ls',
        foo_ss_idsp: 'John Doe',
        foo_win_idsp_qs: 'val2',
        foo_managed_idsp: '123456789',
        foo_provider: 'bar_provider',
      })
      expect(listener).toHaveBeenNthCalledWith(2, {
        foo_win_idsp: 'bar_win2',
        foo_cook_idsp: 'bar_cook',
        foo_dl_idsp: 'val_dl2',
        foo_qs_idsp: 'bar_qs',
        foo_ls_idsp: 'bar_ls',
        foo_ss_idsp: 'John Doe',
        foo_win_idsp_qs: 'val2',
        foo_managed_idsp: '123456789',
        foo_provider: 'bar_provider',
      })
      done()
    }, 100)
  })
})
