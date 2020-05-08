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
import * as pa from './pending/actions'

export type DomActions =
  ga.GeometryActions |
  i18na.I18nActions |
  na.NotificationActions |
  da.DialogActions



export type NetAction =
  pa.PendingActions |
  ReceiveUser |
  ReceiveAccounts |
  ReceiveCategories |
  ReceiveTransactions |
  ReceivePayees



/**
 * User
 */

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
    return dispatch(pa.trackRequest<t.UserRes>({
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



/**
 * Categories
 */

export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES'

interface ReceiveCategories extends t.AppAction {
  type: typeof RECEIVE_CATEGORIES,
  payload: {
    categories: t.CategoryListRes,
  },
}

export function receiveCategories(categories: t.CategoryListRes): ReceiveCategories {
  return {
    type: RECEIVE_CATEGORIES,
    payload: {
      categories,
    },
  }
}

export function fetchCategories(
  message: string
): t.AppThunk<Promise<t.CategoryListRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'getCategories',
      promise: n.authedJsonFetch<t.CategoryListRes>('/api/categories'),
    }))
      .then((categories) => {
        dispatch(receiveCategories(categories))
        return categories
      })
  }
}

export function createCategory(
  category: t.CategoryReq,
  message: string
): t.AppThunk<Promise<t.CategoryRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'postCategory',
      promise: n.authedJsonFetch<t.CategoryRes>('/api/categories', {
        method: 'POST',
        body: category,
      }),
    }))
  }
}

export function updateCategory(
  id: string,
  category: t.CategoryReq,
  message: string,
): t.AppThunk<Promise<t.CategoryRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'postCategory',
      promise: n.authedJsonFetch<t.CategoryRes>(`/api/categories/${id}`, {
        method: 'POST',
        body: category,
      }),
    }))
  }
}

export function deleteCategory(
  id: string,
  message: string
): t.AppThunk<Promise<t.CategoryRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'deleteCategory',
      promise: n.authedJsonFetch<t.CategoryRes>(`/api/categories/${id}`, {
        method: 'DELETE',
      }),
    }))
  }
}



/**
 * Accounts
 */

export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS'

interface ReceiveAccounts extends t.AppAction {
  type: typeof RECEIVE_ACCOUNTS,
  payload: {
    accounts: t.AccountListRes,
  },
}

export function receiveAccounts(accounts: t.AccountListRes): ReceiveAccounts {
  return {
    type: RECEIVE_ACCOUNTS,
    payload: {
      accounts,
    },
  }
}

export function fetchAccounts(
  message: string
): t.AppThunk<Promise<t.AccountListRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest<t.AccountListRes>({
      message,
      requestName: 'getAccounts',
      promise: n.authedJsonFetch<t.AccountListRes>('/api/accounts'),
    }))
      .then((accounts) => {
        dispatch(receiveAccounts(accounts))
        return accounts
      })
  }
}

export function createAccount(
  account: t.AccountReq,
  message: string
): t.AppThunk<Promise<t.AccountRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest<t.AccountRes>({
      message,
      requestName: 'postAccount',
      promise: n.authedJsonFetch<t.AccountRes>('/api/accounts', {
        method: 'POST',
        body: account,
      }),
    }))
  }
}

export function updateAccount(
  id: string,
  account: t.AccountReq,
  message: string
): t.AppThunk<Promise<t.AccountRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest<t.AccountRes>({
      message,
      requestName: 'postAccount',
      promise: n.authedJsonFetch<t.AccountRes>(`/api/accounts/${id}`, {
        method: 'POST',
        body: account,
      }),
    }))
  }
}

export function deleteAccount (
  id: string,
  message: string
): t.AppThunk<Promise<t.AccountRes>>{
  return (dispatch) => {
    return dispatch(pa.trackRequest<t.AccountRes>({
      message,
      requestName: 'deleteAccount',
      promise: n.authedJsonFetch<t.AccountRes>(`/api/accounts/${id}`, {
        method: 'DELETE',
      }),
    }))
  }
}



/**
 * Payees
 */

export const RECEIVE_PAYEES = 'RECEIVE_PAYEES'

interface ReceivePayees extends t.AppAction {
  type: typeof RECEIVE_PAYEES,
  payload: {
    payees: t.PayeeListRes,
  },
}

export function receivePayees(payees: t.PayeeListRes): ReceivePayees {
  return {
    type: RECEIVE_PAYEES,
    payload: {
      payees,
    },
  }
}

export function fetchPayees(
  message: string
): t.AppThunk<Promise<t.PayeeListRes>> {
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
): t.AppThunk<Promise<t.PayeeRes>> {
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
): t.AppThunk<Promise<t.PayeeRes>> {
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
): t.AppThunk<Promise<t.PayeeRes>> {
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
): t.AppThunk<Promise<t.TransactionRes>> {
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
): t.AppThunk<Promise<t.TransactionRes>> {
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
): t.AppThunk<Promise<t.TransactionRes>> {
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
