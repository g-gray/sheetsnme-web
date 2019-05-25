import * as emerge from 'emerge'
import * as xhttp from 'xhttp'
import * as e from './env'
import * as u from './utils'

export function authedJsonFetch(url, params) {
  // TODO Review this approach
  const state = e.store.getState()
  params = emerge.merge(params, {headers: u.langHeaders(state.dom.lang)})

  return authedHttpFetch(url, u.jsonParams(params))
    .then(({body}) => body)
    .catch(response => {
      if (response.body.errors) {
        throw response.body.errors
      }

      throw response
    })
}

export function authedHttpFetch(url, params) {
  return httpFetch({url, ...params})
    .catch(response => {
      if (response.status === 401) {
        window.location = `/auth/login/${u.encodeQuery({redirectTo: window.location.href})}`
        return
      }

      throw response
    })
}

function httpFetch(params) {
  // eslint-disable-next-line promise/avoid-new, promise/no-native
  return new Promise((resolve, reject) => {
    xhttp.Xhttp(params, response => {
      if (response.ok) resolve(response)
      else reject(response)
    })
  })
}
