import * as t from '../types'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from './actions'

const DEFAULT_TIMEOUT = 3000

export const defaultState: t.NotificationsState = []

export const notifications = (
  state = defaultState,
  action: a.NotificationActions
) => {
  switch (action.type) {
    case a.ADD_NOTIFICATION: {
      const {text, timeout = DEFAULT_TIMEOUT, time} = action.payload
      return [
        ...state,
        {
          text,
          timeout,
          time,
        },
      ]
    }

    case a.REMOVE_NOTIFICATION: {
      const {time} = action.payload
      return fpx.filter(
        state,
        (notification: t.Notification) => {
          return notification.time !== time
        }
      )
    }

    default:
      return state
  }
}
