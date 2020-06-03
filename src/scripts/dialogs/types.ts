import * as t from '../types'

export type DialogsState = DialogList

export type DialogList = Dialog<unknown>[]

export type Dialog<P> = t.RReactElement<P & DialogProps>

export type DialogProps = {
  className?: string,
  onEscape? : (event: KeyboardEvent) => void,
  children? : t.RReactChildren,
}
