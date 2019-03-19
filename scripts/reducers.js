import {combineReducers} from 'redux'

const dom = (state = {}, action) => {
  switch (action.type) {
    case 'RESIZE':
      return {
        ...state,
        geometry: action.geometry,
      }
    case 'SET_MOBILE_LAYOUT':
      return {
        ...state,
        isMobileLayout: action.isMobileLayout,
      }
    default:
      return state
  }
}

export const rootReducer = combineReducers({
  dom,
})
