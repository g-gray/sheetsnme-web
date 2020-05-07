import * as t from './types'

import * as a from './actions'

const MOBILE_WIDTH_MAX: number = 980

export const defaultState: t.GeometryState = defGeometry(window.innerWidth)

export const geometry = (state = defaultState, action: a.GeometryActions) => {
  switch (action.type) {
    case a.RESIZE: {
      const {width} = action.payload
      return {
        ...state,
        ...defGeometry(width),
      }
    }

    default:
      return state
  }
}

function defGeometry(width: number): t.Geometry {
  return {isMobile: width <= MOBILE_WIDTH_MAX}
}
