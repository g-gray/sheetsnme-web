import * as t from '../types'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from './actions'

export const defaultState: t.DialogsState = []

export const dialogs = (state = defaultState, action: a.DialogActions) => {
  switch (action.type) {
    case a.ADD_DIALOG: {
      const {dialog} = action.payload
      return fpx.append(state, dialog)
    }

    case a.REMOVE_DIALOG: {
      const {dialog} = action.payload
      // TODO Reject dialog from state instead of just popping it from state
      return fpx.init(state)
    }

    default:
      return state
  }
}
