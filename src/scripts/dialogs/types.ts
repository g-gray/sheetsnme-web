import * as t from '../types'

export type DialogsState = DialogList

export type DialogList = Dialog<unknown>[]

export type Dialog<P> = {
  dialog      : t.RComponentType<DialogProps<P>>,
  dialogProps?: DialogProps<P>,
}

export type DialogProps<P> = P & {
  className?   : string,
  dialogsNumber: number,
  onEscape?    : (event: KeyboardEvent) => void,
}
