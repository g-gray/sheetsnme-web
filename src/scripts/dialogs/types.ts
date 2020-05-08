export type DialogsState = DialogList

export type Dialog<P> = {
  dialog: t.RComponentType<P>,
  dialogProps?: P,
}

export type DialogList = Dialog<any>[]
