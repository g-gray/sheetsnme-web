import * as t from '../types'

import * as n from '../net'
import * as pa from '../pending/actions'

export type PayeeActions = ReceivePayees


export const RECEIVE_PAYEES = 'RECEIVE_PAYEES'

interface ReceivePayees extends t.AppAction {
  type: typeof RECEIVE_PAYEES,
  payload: {
    payeeList: t.PayeeListRes,
  },
}

export function receivePayees(payeeList: t.PayeeListRes): ReceivePayees {
  return {
    type: RECEIVE_PAYEES,
    payload: {
      payeeList,
    },
  }
}

export function fetchPayees(
  message: string
): t.AppThunkAction<Promise<t.PayeeListRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'getPayees',
      promise: n.authedJsonFetch<t.PayeeListRes>('/api/payees'),
    }))
      .then((payees) => {
        dispatch(receivePayees(payees))
        return payees
      })
  }
}

export function createPayee(
  payee: t.PayeeReq,
  message: string
): t.AppThunkAction<Promise<t.PayeeRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'postPayee',
      promise: n.authedJsonFetch<t.PayeeRes>('/api/payees', {
        method: 'POST',
        body: payee,
      }),
    }))
  }
}

export function updatePayee(
  id: string,
  payee: t.PayeeReq,
  message: string
): t.AppThunkAction<Promise<t.PayeeRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'postPayee',
      promise: n.authedJsonFetch<t.PayeeRes>(`/api/payees/${id}`, {
        method: 'POST',
        body: payee,
      }),
    }))
  }
}

export function deletePayee(
  id: string,
  message: string
): t.AppThunkAction<Promise<t.PayeeRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'deletePayee',
      promise: n.authedJsonFetch<t.PayeeRes>(`/api/payees/${id}`, {
        method: 'DELETE',
      }),
    }))
  }
}
