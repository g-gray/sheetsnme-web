import {combineReducers} from 'redux'

const dom = (state = {}, action) => {
  switch (action.type) {
    case 'RESIZE':
      return {
        ...state,
        geometry: action.geometry,
      }
    default:
      return state
  }
}

const net = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_TRANSACTIONS':
      switch (action.status) {
        case 'error':
          return {
            ...state,
            pending: false,
            error: action.error,
          }
        case 'success':
          return {
            ...state,
            pending: false,
            transactions: action.transactions,
          }
        default:
          return {
            ...state,
            pending: true,
            action: action.type,
          }
      }
    default:
      return state
  }
}

export const rootReducer = combineReducers({
  dom,
  net,
})
