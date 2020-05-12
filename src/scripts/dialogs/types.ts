import * as t from '../types'

export type DialogsState = DialogList

export type Dialog<P> = {
  dialog: t.DialogComponent<P>,
  dialogProps?: P,
}

export type DialogComponent<P> = t.RComponentType<DialogProps<P>>

export type DialogProps<P = {}> = P & {
  className?: string,
  dialogsNumber?: number,
  onEscape: (event: t.RKeyboardEvent) => void,
}

export type DialogList = Dialog<any>[]
