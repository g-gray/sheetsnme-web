import * as t from '../types'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from './actions'

export const defaultState: t.DialogsState = []

export const dialogs = (state = defaultState, action: a.DialogActions) => {
  switch (action.type) {
    case a.ADD_DIALOG: {
      const {dialog, dialogProps} = action.payload
      return fpx.append(state, {
        dialog,
        dialogProps,
      })
    }

    case a.REMOVE_DIALOG: {
      return fpx.init(state)
    }

    default:
      return state
  }
}
