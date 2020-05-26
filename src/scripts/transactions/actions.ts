import * as t from '../types'

import * as n from '../net'
import * as u from '../utils'
import * as pa from '../pending/actions'

export type TransactionActions = ReceiveTransactions


export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS'

interface ReceiveTransactions extends t.ReduxAction {
  type: typeof RECEIVE_TRANSACTIONS,
  payload: {
    transactionList: t.TransactionListRes,
  },
}

export function receiveTransactions(transactionList: t.TransactionListRes): ReceiveTransactions {
  return {
    type: RECEIVE_TRANSACTIONS,
    payload: {
      transactionList,
    },
  }
}

export function fetchTransactions(
  location: t.RRLocation,
  message: string
): t.ReduxThunkAction<Promise<t.TransactionListRes>> {
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

    return dispatch(pa.trackRequest({
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
): t.ReduxThunkAction<Promise<t.TransactionRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
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
): t.ReduxThunkAction<Promise<t.TransactionRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
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
): t.ReduxThunkAction<Promise<t.TransactionRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'deleteTransaction',
      promise: n.authedJsonFetch<t.TransactionRes>(`/api/transactions/${id}`, {
        method: 'DELETE',
      }),
    }))
  }
}
