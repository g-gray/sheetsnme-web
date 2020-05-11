import * as t from './types'

import * as u from './utils'
import * as n from './net'

export * from './geometry/actions'
import * as ga from './geometry/actions'

export * from './i18n/actions'
import * as i18na from './i18n/actions'

export * from './notifications/actions'
import * as na from './notifications/actions'

export * from './dialogs/actions'
import * as da from './dialogs/actions'

export * from './pending/actions'
import * as pena from './pending/actions'

export * from './user/actions'
import * as ua from './user/actions'

export * from './categories/actions'
import * as ca from './categories/actions'

export * from './accounts/actions'
import * as aa from './accounts/actions'

export * from './payees/actions'
import * as pa from './payees/actions'

export type DomActions =
  ga.GeometryActions |
  i18na.I18nActions |
  na.NotificationActions |
  da.DialogActions

export type NetAction =
  pena.PendingActions |
  ua.UserActions |
  ca.CategoryActions |
  aa.AccountActions |
  pa.PayeeActions |
  ReceiveTransactions



/**
 * Transactions
 */

export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS'

interface ReceiveTransactions extends t.AppAction {
  type: typeof RECEIVE_TRANSACTIONS,
  payload: {
    transactions: t.TransactionListRes,
  },
}

export function receiveTransactions(transactions: t.TransactionListRes): ReceiveTransactions {
  return {
    type: RECEIVE_TRANSACTIONS,
    payload: {
      transactions: transactions,
    },
  }
}

export function fetchTransactions(
  location: t.RLocation,
  message: string
): t.AppThunk<Promise<t.TransactionListRes>> {
  return (dispatch) => {
    const query = u.decodeQuery(location.search)
    const page: number = parseInt(Array.isArray(query.page)
      ? query.page[0]
      : query.page
    ) || 1
    const offset = String(u.DEFAULT_PAGE_SIZE * (page - 1))
    const limit = String(u.DEFAULT_PAGE_SIZE)
    const filter: t.TransactionsFilter = {
      ...query,
      offset,
      limit,
    }

    return dispatch(pena.trackRequest({
      message,
      requestName: 'getTransactions',
      promise: n.authedJsonFetch<t.TransactionListRes>('/api/transactions', {
        method: 'GET',
        body: filter,
      }),
    }))
      .then(transactions => {
        dispatch(receiveTransactions(transactions))
        return transactions
      })
  }
}

export function createTransaction(
  transaction: t.TransactionReq,
  message: string
): t.AppThunk<Promise<t.TransactionRes>> {
  return (dispatch) => {
    return dispatch(pena.trackRequest({
      message,
      requestName: 'postTransaction',
      promise: n.authedJsonFetch<t.TransactionRes>('/api/transactions', {
        method: 'POST',
        body: transaction,
      }),
    }))
  }
}

export function updateTransaction(
  id: string,
  transaction: t.TransactionReq,
  message: string
): t.AppThunk<Promise<t.TransactionRes>> {
  return (dispatch) => {
    return dispatch(pena.trackRequest({
      message,
      requestName: 'postTransaction',
      promise: n.authedJsonFetch<t.TransactionRes>(`/api/transactions/${id}`, {
        method: 'POST',
        body: transaction,
      }),
    }))
  }
}

export function deleteTransaction(
  id: string,
  message:string
): t.AppThunk<Promise<t.TransactionRes>> {
  return (dispatch) => {
    return dispatch(pena.trackRequest({
      message,
      requestName: 'deleteTransaction',
      promise: n.authedJsonFetch<t.TransactionRes>(`/api/transactions/${id}`, {
        method: 'DELETE',
      }),
    }))
  }
}
