import * as u from './utils'

export function authedJsonFetch(url, params) {
  return authedHttpFetch(url, u.jsonParams(params))
    .then(response => {
      return response.json()
        .then(json => {
          if (json.errors) {
            return window.Promise.reject(json.errors)
          }

          return json
        })
    })
}

export function authedHttpFetch(url, params) {
  return httpFetch(url, params)
    .then(response => {
      if (response.status === 401) {
        window.location = `/auth/login?redirectTo=${encodeURIComponent(window.location.href)}`
      }

      return response
    })
}

export function httpFetch(url, params) {
  return window.fetch(url, params)
}
