import * as u from './utils'

export function authedJsonFetch(url, params) {
  return authedHttpFetch(url, u.jsonParams(params))
    .then(response => response.json())
}

export function authedHttpFetch(url, params) {
  return httpFetch(url, params)
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          window.location = `/auth/login?redirectTo=${encodeURIComponent(window.location.href)}`
        }

        throw Error(`${response.status} ${response.statusText}`)
      }

      return response
    })
}

export function httpFetch(url, params) {
  return window.fetch(url, params)
}
