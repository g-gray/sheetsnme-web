export type DialogsState = DialogList

export type Dialog<P> = {
  dialog: React.ComponentType<P>,
  dialogProps?: P,
}

export type DialogList = Dialog<any>[]
