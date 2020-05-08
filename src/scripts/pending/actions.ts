import * as t from '../types'

import * as na from '../notifications/actions'

export type PendingActions = RequestStartAction | RequestEndAction


export function trackRequest<P>(
  opts: {message: string, requestName: string, promise: Promise<P>}
): t.AppThunk<Promise<P>> {
  return (dispatch): Promise<P> => {
    const {message, requestName, promise} = opts

    const action = dispatch(na.addNotification(message, 0))
    const {time} = action.payload

    dispatch(requestStart(requestName))

    return promise
      .then((response: any) => {
        dispatch(requestEnd(requestName))
        if (time) {
          dispatch(na.removeNotification(time))
        }
        return response
      })
      .catch((response: any) => {
        dispatch(requestEnd(requestName))
        if (time) {
          dispatch(na.removeNotification(time))
        }
        throw response
      })
    }
}


export const REQUEST_START = 'REQUEST_START'

interface RequestStartAction extends t.AppAction {
  type: typeof REQUEST_START,
  payload: {
    requestName: string,
  },
}

const requestStart = (requestName: string): RequestStartAction => ({
  type: REQUEST_START,
  payload: {
    requestName,
  },
})


export const REQUEST_END = 'REQUEST_END'

interface RequestEndAction extends t.AppAction {
  type: typeof REQUEST_END,
  payload: {
    requestName: string,
  },
}

const requestEnd = (requestName: string): RequestEndAction => ({
  type: REQUEST_END,
  payload: {
    requestName,
  },
})
