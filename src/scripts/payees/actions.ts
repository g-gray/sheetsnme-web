import * as t from '../types'

import * as n from '../net'
import * as pa from '../pending/actions'

export type PayeeActions = ReceivePayees | ReceivePayeesDebts


export const RECEIVE_PAYEES = 'RECEIVE_PAYEES'

interface ReceivePayees extends t.ReduxAction {
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
): t.ReduxThunkAction<Promise<t.PayeeListRes>> {
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
): t.ReduxThunkAction<Promise<t.PayeeRes>> {
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
): t.ReduxThunkAction<Promise<t.PayeeRes>> {
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
): t.ReduxThunkAction<Promise<t.PayeeRes>> {
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



/**
 * Debts
 */

export const RECEIVE_PAYEES_DEBTS = 'RECEIVE_PAYESS_DEBTS'

interface ReceivePayeesDebts extends t.ReduxAction {
  type: typeof RECEIVE_PAYEES_DEBTS,
  payload: {
    payeesDebts: t.PayeesDebtsRes,
  },
}

export function receivePayeesDebts(
  payeesDebts: t.PayeesDebtsRes
): ReceivePayeesDebts {
  return {
    type: RECEIVE_PAYEES_DEBTS,
    payload: {
      payeesDebts,
    },
  }
}


export function fetchPayeesDebts(
  message: string
): t.ReduxThunkAction<Promise<t.PayeesDebtsRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'getPayeesDebts',
      promise: n.authedJsonFetch<t.PayeesDebtsRes>('/api/payees/debts'),
    }))
      .then((payeesDebts) => {
        dispatch(receivePayeesDebts(payeesDebts))
        return payeesDebts
      })
  }
}
