import * as e from 'emerge'
import * as u from './utils'

export function authedJsonFetch(url, params) {
  // TODO Review this approach
  const state = window.env.store.getState()
  params = e.merge(params, {headers: u.langHeaders(state.dom.lang)})

  return authedHttpFetch(url, u.jsonParams(params))
    .then(response => response.json())
    .then(json => {
      if (json.errors) {
        return Promise.reject(json.errors)
      }

      return json
    })
}

export function authedHttpFetch(url, params) {
  return httpFetch(url, {credentials: 'same-origin', ...params})
    .then(response => {
      if (response.status === 401) {
        window.location = `/auth/login?redirectTo=${encodeURIComponent(window.location.href)}`
      }

      return response
    })
}

export function httpFetch(url, params) {
  return fetch(url, params)
}
