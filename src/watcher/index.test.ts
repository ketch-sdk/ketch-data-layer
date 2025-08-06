import Watcher from './index'
import {
  Identity,
  IdentityEncoding,
  IdentityFormat,
  IdentityType,
  Trait,
  TraitEncoding,
  TraitFormat,
  TraitType,
  TraitName,
} from '@ketch-sdk/ketch-types'

jest.mock('uuid', () => ({ v4: () => '123456789' }))

describe('watcher', () => {
  it('starts', () => {
    jest.spyOn(global.console, 'log').mockImplementation(() => {})

    return new Promise<void>(resolve => {
      let watcher = new Watcher(window)
      watcher = new Watcher(window, {
        interval: 500,
        timeout: 3000,
      })

      const w = window as any
      w['foo_win'] = 'bar_win'
      w['foo_win_qs'] = 'bar1=val1;bar2=val2'
      window.document.cookie = 'foo_cook=bar_cook'
      window.document.cookie = 'test={"foo":{"bar":{"baz":1}}}'
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ foo_dl: 'bar_dl1=val_dl&bar_dl2=val_dl2' })
      window.dataLayer.push({ foo_dl2: { id: 123 } })
      window.localStorage.setItem('foo_ls', JSON.stringify({ value: 'bar_ls' }))
      window.sessionStorage.setItem(
        'foo_ss',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwi' +
          'aWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      )
      // window.location.search = 'foo_qs=bar_qs' - this has to be setup in jest.config.js
      // foo_qs=bar_qs&foo_qs_base64_string=dGVzdEBlbWFpbC5jb20%3D&
      // foo_qs_base64_json=eyJlbWFpbCI6ICJ0ZXN0QGVtYWlsLmNvbSIsICJuYW1lIjogInRlc3QifQ%3D%3D&foo_qs_noop=bar_qs_noop

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
      watcher.add('test_idsp', {
        type: IdentityType.IDENTITY_TYPE_COOKIE,
        format: IdentityFormat.IDENTITY_FORMAT_JSON,
        variable: 'test',
        key: 'foo.bar.baz',
      })
      watcher.add('foo_dl_idsp', {
        type: IdentityType.IDENTITY_TYPE_DATA_LAYER,
        format: IdentityFormat.IDENTITY_FORMAT_QUERY,
        variable: 'foo_dl',
        key: 'bar_dl2',
      })
      watcher.add('foo_dl2_idsp', {
        type: IdentityType.IDENTITY_TYPE_DATA_LAYER,
        format: IdentityFormat.IDENTITY_FORMAT_JSON,
        variable: 'foo_dl2',
        key: 'id',
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
      watcher.add('foo_qs_idsp_base64_string', {
        type: IdentityType.IDENTITY_TYPE_QUERY_STRING,
        format: IdentityFormat.IDENTITY_FORMAT_STRING,
        variable: 'foo_qs_base64_string',
        encoding: IdentityEncoding.IDENTITY_ENCODING_BASE64,
      })
      watcher.add('foo_qs_idsp_base64_json', {
        type: IdentityType.IDENTITY_TYPE_QUERY_STRING,
        format: IdentityFormat.IDENTITY_FORMAT_JSON,
        variable: 'foo_qs_base64_json',
        key: 'email',
        encoding: IdentityEncoding.IDENTITY_ENCODING_BASE64,
      })
      watcher.add('foo_qs_idsp_noop', {
        type: IdentityType.IDENTITY_TYPE_QUERY_STRING,
        format: IdentityFormat.IDENTITY_FORMAT_STRING,
        variable: 'foo_qs_noop',
        encoding: IdentityEncoding.IDENTITY_ENCODING_NONE,
      })
      watcher.add('foo_provider', () => Promise.resolve(['bar_provider']))
      watcher.add('bad_provider', () => Promise.reject('expected to throw'))
      expect(() => {
        watcher.add('corrupt_type', {} as Identity)
      }).toThrow()
      const listener = jest.fn().mockName('listener') // .mockImplementation(console.log)
      const onceListener = jest.fn().mockName('listener') // .mockImplementation(console.log)
      watcher.addListener('identity', listener)
      watcher.once('identity', onceListener)
      watcher.start(TraitName.IDENTITY, false)
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
        watcher.off('identity', listener)
        watcher.removeAllListeners('identity')
        expect(onceListener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenNthCalledWith(1, {
          foo_win_idsp: 'bar_win',
          foo_cook_idsp: 'bar_cook',
          test_idsp: '1',
          foo_dl_idsp: 'val_dl2',
          foo_dl2_idsp: '123',
          foo_qs_idsp: 'bar_qs',
          foo_qs_idsp_base64_json: 'test@email.com',
          foo_qs_idsp_base64_string: 'test@email.com',
          foo_qs_idsp_noop: 'bar_qs_noop',
          foo_ls_idsp: 'bar_ls',
          foo_ss_idsp: 'John Doe',
          foo_win_idsp_qs: 'val2',
          foo_managed_idsp: '123456789',
          foo_provider: 'bar_provider',
        })
        expect(listener).toHaveBeenNthCalledWith(2, {
          foo_win_idsp: 'bar_win2',
          foo_cook_idsp: 'bar_cook',
          test_idsp: '1',
          foo_dl_idsp: 'val_dl2',
          foo_dl2_idsp: '123',
          foo_qs_idsp: 'bar_qs',
          foo_qs_idsp_base64_json: 'test@email.com',
          foo_qs_idsp_base64_string: 'test@email.com',
          foo_qs_idsp_noop: 'bar_qs_noop',
          foo_ls_idsp: 'bar_ls',
          foo_ss_idsp: 'John Doe',
          foo_win_idsp_qs: 'val2',
          foo_managed_idsp: '123456789',
          foo_provider: 'bar_provider',
        })
        resolve(undefined)
      }, 100)
    })
  })

  it('starts for userAttribute', () => {
    jest.spyOn(global.console, 'log').mockImplementation(() => {})

    return new Promise<void>(resolve => {
      let watcher = new Watcher(window)
      watcher = new Watcher(window, {
        interval: 500,
        timeout: 3000,
      })

      const w = window as any
      w['foo_win'] = 'bar_win'
      w['foo_win_qs'] = 'bar1=val1;bar2=val2'
      window.document.cookie = 'foo_cook=bar_cook'
      window.document.cookie = 'test={"foo":{"bar":{"baz":1}}}'
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ foo_dl: 'bar_dl1=val_dl&bar_dl2=val_dl2' })
      window.dataLayer.push({ foo_dl2: { id: 123 } })
      window.localStorage.setItem('foo_ls', JSON.stringify({ value: 'bar_ls' }))
      window.sessionStorage.setItem(
        'foo_ss',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwi' +
          'aWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      )
      // window.location.search = 'foo_qs=bar_qs' - this has to be setup in jest.config.js
      // foo_qs=bar_qs&foo_qs_base64_string=dGVzdEBlbWFpbC5jb20%3D&
      // foo_qs_base64_json=eyJlbWFpbCI6ICJ0ZXN0QGVtYWlsLmNvbSIsICJuYW1lIjogInRlc3QifQ%3D%3D&foo_qs_noop=bar_qs_noop

      watcher.add('foo_win_idsp', {
        type: TraitType.TRAIT_TYPE_WINDOW,
        format: TraitFormat.TRAIT_FORMAT_STRING,
        variable: 'window.foo_win',
      })
      watcher.add('foo_win_idsp_qs', {
        type: TraitType.TRAIT_TYPE_WINDOW,
        format: TraitFormat.TRAIT_FORMAT_SEMICOLON,
        variable: 'window.foo_win_qs',
        key: 'bar2',
      })
      watcher.add('foo_cook_idsp', {
        type: TraitType.TRAIT_TYPE_COOKIE,
        format: TraitFormat.TRAIT_FORMAT_STRING,
        variable: 'foo_cook',
      })
      watcher.add('test_idsp', {
        type: TraitType.TRAIT_TYPE_COOKIE,
        format: TraitFormat.TRAIT_FORMAT_JSON,
        variable: 'test',
        key: 'bad.path',
      })
      watcher.add('foo_dl_idsp', {
        type: TraitType.TRAIT_TYPE_DATA_LAYER,
        format: TraitFormat.TRAIT_FORMAT_QUERY,
        variable: 'foo_dl',
        key: 'bar_dl2',
      })
      watcher.add('foo_dl2_idsp', {
        type: TraitType.TRAIT_TYPE_DATA_LAYER,
        format: TraitFormat.TRAIT_FORMAT_JSON,
        variable: 'foo_dl2',
        key: 'id',
      })
      watcher.add('foo_qs_idsp', {
        type: TraitType.TRAIT_TYPE_QUERY_STRING,
        format: TraitFormat.TRAIT_FORMAT_STRING,
        variable: 'foo_qs',
      })
      watcher.add('foo_ls_idsp', {
        type: TraitType.TRAIT_TYPE_LOCAL_STORAGE,
        format: TraitFormat.TRAIT_FORMAT_JSON,
        variable: 'foo_ls',
        key: 'value',
      })
      watcher.add('foo_ss_idsp', {
        type: TraitType.TRAIT_TYPE_SESSION_STORAGE,
        format: TraitFormat.TRAIT_FORMAT_JWT,
        variable: 'foo_ss',
        key: 'name',
      })
      watcher.add('foo_managed_idsp', {
        type: TraitType.TRAIT_TYPE_MANAGED,
        format: TraitFormat.TRAIT_FORMAT_STRING,
        variable: 'foo_managed',
      })
      watcher.add('foo_qs_idsp_base64_string', {
        type: TraitType.TRAIT_TYPE_QUERY_STRING,
        format: TraitFormat.TRAIT_FORMAT_STRING,
        variable: 'foo_qs_base64_string',
        encoding: TraitEncoding.TRAIT_ENCODING_BASE64,
      })
      watcher.add('foo_qs_idsp_base64_json', {
        type: TraitType.TRAIT_TYPE_QUERY_STRING,
        format: TraitFormat.TRAIT_FORMAT_JSON,
        variable: 'foo_qs_base64_json',
        key: 'email',
        encoding: TraitEncoding.TRAIT_ENCODING_BASE64,
      })
      watcher.add('foo_qs_idsp_noop', {
        type: TraitType.TRAIT_TYPE_QUERY_STRING,
        format: TraitFormat.TRAIT_FORMAT_STRING,
        variable: 'foo_qs_noop',
        encoding: TraitEncoding.TRAIT_ENCODING_NONE,
      })
      watcher.add('foo_provider', () => Promise.resolve(['bar_provider']))
      watcher.add('bad_provider', () => Promise.reject('expected to throw'))
      expect(() => {
        watcher.add('corrupt_type', {} as Trait)
      }).toThrow()
      const listener = jest.fn().mockName('listener') // .mockImplementation(console.log)
      const onceListener = jest.fn().mockName('listener') // .mockImplementation(console.log)
      watcher.addListener('userAttribute', listener)
      watcher.once('userAttribute', onceListener)
      watcher.start(TraitName.USER_ATTRIBUTE, true)
      watcher.start(TraitName.USER_ATTRIBUTE, true)
      watcher.notify(TraitName.USER_ATTRIBUTE, true)
      w['foo_win'] = 'bar_win2'
      watcher.notify(TraitName.USER_ATTRIBUTE)
      watcher.notify(TraitName.USER_ATTRIBUTE)
      watcher.notify(TraitName.USER_ATTRIBUTE)
      watcher.stop()
      watcher.stop()

      setTimeout(() => {
        watcher.removeListener('userAttribute', listener)
        watcher.off('userAttribute', listener)
        watcher.removeAllListeners('userAttribute')
        expect(onceListener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenNthCalledWith(1, {
          foo_win_idsp: 'bar_win',
          foo_cook_idsp: 'bar_cook',
          test_idsp: 'undefined',
          foo_dl_idsp: 'val_dl2',
          foo_dl2_idsp: '123',
          foo_qs_idsp: 'bar_qs',
          foo_qs_idsp_base64_json: 'test@email.com',
          foo_qs_idsp_base64_string: 'test@email.com',
          foo_qs_idsp_noop: 'bar_qs_noop',
          foo_ls_idsp: 'bar_ls',
          foo_ss_idsp: 'John Doe',
          foo_win_idsp_qs: 'val2',
          foo_managed_idsp: '123456789',
          foo_provider: 'bar_provider',
        })
        expect(listener).toHaveBeenNthCalledWith(2, {
          foo_win_idsp: 'bar_win2',
          foo_cook_idsp: 'bar_cook',
          test_idsp: 'undefined',
          foo_dl_idsp: 'val_dl2',
          foo_dl2_idsp: '123',
          foo_qs_idsp: 'bar_qs',
          foo_qs_idsp_base64_json: 'test@email.com',
          foo_qs_idsp_base64_string: 'test@email.com',
          foo_qs_idsp_noop: 'bar_qs_noop',
          foo_ls_idsp: 'bar_ls',
          foo_ss_idsp: 'John Doe',
          foo_win_idsp_qs: 'val2',
          foo_managed_idsp: '123456789',
          foo_provider: 'bar_provider',
        })
        resolve(undefined)
      }, 100)
    })
  })
})
