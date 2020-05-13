import * as t from './types'

import * as a from './actions'

export const defaultState: t.UserState = null

export const user = (state = defaultState, action: a.UserActions) => {
  switch (action.type) {
    case a.RECEIVE_USER: {
      const {user} = action.payload

      return {
        ...(state || {}),
        ...user,
      }
    }

    default:
      return state
  }
}
