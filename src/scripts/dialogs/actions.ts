import * as t from '../types'

export type DialogActions = AddDialog | RemoveDialog


export const ADD_DIALOG = 'ADD_DIALOG'

interface AddDialog<P = any> extends t.ReduxAction {
  type: typeof ADD_DIALOG,
  payload: {
    dialog: t.RComponentType<t.DialogProps<P>>,
    dialogProps?: Omit<t.DialogProps<P>, 'dialogsNumber'>,
  },
}

export function addDialog<P>(
  dialog: t.RComponentType<t.DialogProps<P>>,
  dialogProps?: Omit<t.DialogProps<P>, 'dialogsNumber'>
): AddDialog<P> {
  return {
    type: ADD_DIALOG,
    payload: {
      dialog,
      dialogProps,
    },
  }
}


export const REMOVE_DIALOG = 'REMOVE_DIALOG'

interface RemoveDialog extends t.ReduxAction {
  type: typeof REMOVE_DIALOG,
}

export function removeDialog(): RemoveDialog {
  return {
    type: REMOVE_DIALOG,
  }
}
