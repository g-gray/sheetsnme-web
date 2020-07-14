import * as t from './types'

// @ts-ignore
import * as emerge from 'emerge'
// @ts-ignore
import * as xhttp from 'xhttp'

import * as e from './env'
import * as u from './utils'

export function authedJsonFetch<P>(
  url: string,
  params?: t.JsonParams
): Promise<P> {
  // TODO Review this approach
  const state: t.AppState = e.store.getState()
  params = emerge.merge(params, {headers: u.langHeaders(state.dom.i18n.lang)})

  return authedHttpFetch(url, u.jsonParams(params))
    .then(({body}) => body)
    .catch(response => {
      if (response.body.errors) {
        throw response.body.errors
      }

      throw response
    })
}

export function authedHttpFetch(
  url: string,
  params: t.XHttpParams
): Promise<t.XHttpResponse> {
  return httpFetch({url, ...params})
    .catch(response => {
      if (response.status === 401) {
        const query = u.encodeQuery({redirectTo: window.location.href})
        window.location.assign(`/auth/login/${query}`)
        throw response
      }

      throw response
    })
}

export function httpFetch(params: t.XHttpParams): Promise<t.XHttpResponse> {
  return new Promise((
      resolve: (response: t.XHttpResponse) => void,
      reject: (reject: t.XHttpResponse) => void
    ) => {
      xhttp.Xhttp(params, (response: t.XHttpResponse) => {
        if (response.ok) resolve(response)
        else reject(response)
    })
  })
}
