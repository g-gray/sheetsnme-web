import * as t from '../types'

export type GeometryActions = Resize

export const RESIZE = 'RESIZE'

interface Resize extends t.AppAction {
  type: typeof RESIZE,
  payload: {
    width: number,
  },
}

export function resize(width: number): Resize {
  return {
    type: RESIZE,
    payload: {
      width,
    }
  }
}
