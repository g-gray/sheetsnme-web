import * as a from './actions'
import * as u from './utils'

export const dom = (state = {
  geometry: u.geometry(window.innerWidth),
}, action) => {
  switch (action.type) {
    case a.RESIZE:
      return {
        ...state,
        geometry: action.geometry,
      }
    default:
      return state
  }
}

export const net = (state = {
  transactions: [],
  pending: [],
  errors: [],
}, action) => {
  switch (action.type) {
    case a.REQUEST_TRANSACTIONS:
      return {
        ...state,
        pending: [...state.pending, a.REQUEST_TRANSACTIONS],
      }
    case a.RECEIVE_TRANSACTIONS:
      return {
        ...state,
        pending: state.pending.filter(item => item !== a.REQUEST_TRANSACTIONS),
        transactions: action.transactions,
      }
    case a.FETCH_ERROR:
      return {
        ...state,
        error: [...state.errors, action.error],
      }
    default:
      return state
  }
}
