import * as t from './types'

import * as u from './utils'
import * as n from './net'

export * from './i18n/actions'
import * as i18n from './i18n/actions'

export type DomActions =
  AddNotification |
  RemoveNotification |
  Resize |
  AddDialog |
  RemoveDialog |
  i18n.NextLang



/**
 * Resize
 */

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



/**
 * Dialogs
 */

export const ADD_DIALOG = 'ADD_DIALOG'

interface AddDialog<P = any> extends t.AppAction {
  type: typeof ADD_DIALOG,
  payload: {
    dialog: t.Dialog<P>,
    dialogProps?: P,
  },
}

export function addDialog<P>(dialog: t.Dialog<P>, dialogProps?: P): AddDialog<P> {
  return {
    type: ADD_DIALOG,
    payload: {
      dialog,
      dialogProps,
    },
  }
}


export const REMOVE_DIALOG = 'REMOVE_DIALOG'

interface RemoveDialog extends t.AppAction {
  type: typeof REMOVE_DIALOG,
}

export function removeDialog(): RemoveDialog {
  return {
    type: REMOVE_DIALOG,
  }
}



/**
 * Notifications
 */

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'

interface AddNotification extends t.AppAction {
  type: typeof ADD_NOTIFICATION,
  payload: {
    text: string,
    timeout?: number,
    time: number,
  },
}

export const addNotification = (text: string, timeout?: number): AddNotification => ({
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

export const removeNotification = (time: number): RemoveNotification => ({
  type: REMOVE_NOTIFICATION,
  payload: {
    time,
  }
})



export type NetAction =
  RequestStartAction |
  RequestEndAction |
  ReceiveUser |
  ReceiveAccounts |
  ReceiveCategories |
  ReceiveTransactions |
  ReceivePayees



/**
 * Request tracking
 */

function trackRequest<P>(
  opts: {message: string, requestName: string, promise: Promise<P>}
): t.AppThunk<Promise<P>> {
  return (dispatch): Promise<P> => {
    const {message, requestName, promise} = opts

    const action = dispatch(addNotification(message, 0))
    const {time} = action.payload

    dispatch(requestStart(requestName))

    return promise
      .then((response: any) => {
        dispatch(requestEnd(requestName))
        if (time) {
          dispatch(removeNotification(time))
        }
        return response
      })
      .catch((response: any) => {
        dispatch(requestEnd(requestName))
        if (time) {
          dispatch(removeNotification(time))
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
    return dispatch(trackRequest<t.UserRes>({
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
    return dispatch(trackRequest({
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
    return dispatch(trackRequest({
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
    return dispatch(trackRequest({
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
    return dispatch(trackRequest({
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
    return dispatch(trackRequest<t.AccountListRes>({
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
    return dispatch(trackRequest<t.AccountRes>({
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
    return dispatch(trackRequest<t.AccountRes>({
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
    return dispatch(trackRequest<t.AccountRes>({
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
    return dispatch(trackRequest({
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
    return dispatch(trackRequest({
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
    return dispatch(trackRequest({
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
    return dispatch(trackRequest({
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

    return dispatch(trackRequest({
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
    return dispatch(trackRequest({
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
    return dispatch(trackRequest({
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
    return dispatch(trackRequest({
      message,
      requestName: 'deleteTransaction',
      promise: n.authedJsonFetch<t.TransactionRes>(`/api/transactions/${id}`, {
        method: 'DELETE',
      }),
    }))
  }
}
