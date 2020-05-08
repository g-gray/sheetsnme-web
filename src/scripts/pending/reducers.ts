import * as t from './types'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from './actions'

export const defaultState: t.PendingState = {}

export const pending = (state = defaultState, action: a.PendingActions) => {
  switch (action.type) {
    case a.REQUEST_START: {
      const {requestName} = action.payload
      return {
        ...state,
        [requestName]: true,
      }
    }

    case a.REQUEST_END: {
      const {requestName} = action.payload
      return fpx.omitBy(
        state,
        (__: boolean, key: string) => {
          return key === requestName
        }
      )
    }

    default:
      return state
  }
}
