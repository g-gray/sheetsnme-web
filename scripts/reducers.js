import {combineReducers} from 'redux'

const dom = (state = [], action) => {
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

export const rootReducer = combineReducers({
  dom,
})
