import * as t from '../types'

export type NotificationActions =
  AddNotification |
  RemoveNotification

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'

interface AddNotification extends t.AppAction {
  type: typeof ADD_NOTIFICATION,
  payload: {
    text: string,
    timeout?: number,
    time: number,
  },
}

export const addNotification = (
  text: string,
  timeout?: number
): AddNotification => ({
  type: ADD_NOTIFICATION,
  payload: {
    text,
    timeout,
    time: new Date().getTime(),
  },
})


export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

interface RemoveNotification extends t.AppAction {
  type: typeof REMOVE_NOTIFICATION,
  payload: {
    time: number,
  },
}

export const removeNotification = (
  time: number
): RemoveNotification => ({
  type: REMOVE_NOTIFICATION,
  payload: {
    time,
  }
})
