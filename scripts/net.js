import * as u from './utils'

export function authedJsonFetch(url, params) {
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
