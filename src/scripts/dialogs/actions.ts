import * as t from '../types'

export type DialogActions = AddDialog<unknown> | RemoveDialog<unknown>


export const ADD_DIALOG = 'ADD_DIALOG'

interface AddDialog<P> extends t.ReduxAction {
  type   : typeof ADD_DIALOG,
  payload: {
    dialog: t.Dialog<P>,
  },
}

export function addDialog<P>(
  dialog: t.Dialog<P>,
): AddDialog<P> {
  return {
    type: ADD_DIALOG,
    payload: {
      dialog,
    },
  }
}


export const REMOVE_DIALOG = 'REMOVE_DIALOG'

interface RemoveDialog<P> extends t.ReduxAction {
  type: typeof REMOVE_DIALOG,
  payload: {
    dialog?: t.Dialog<P>,
  }
}

export function removeDialog<P>(
  dialog?: t.Dialog<P>
): RemoveDialog<P> {
  return {
    type: REMOVE_DIALOG,
    payload: {
      dialog,
    },
  }
}
