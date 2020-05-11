import * as t from '../types'

import * as n from '../net'
import * as a from '../actions'

export type UserActions = ReceiveUser


export const RECEIVE_USER = 'RECEIVE_USER'

interface ReceiveUser extends t.AppAction {
  type: typeof RECEIVE_USER,
  payload: {
    user: t.UserRes,
  },
}

export function receiveUser(user: t.UserRes): ReceiveUser {
  return {
    type: RECEIVE_USER,
    payload: {
      user,
    },
  }
}

export function fetchUser(message: string): t.AppThunk<Promise<t.UserRes>> {
  return (dispatch) => {
    return dispatch(a.trackRequest<t.UserRes>({
      message,
      requestName: 'getUser',
      promise: n.authedJsonFetch('/api/user'),
    }))
      .then((user) => {
        dispatch(receiveUser(user))
        return user
      })
  }
}
