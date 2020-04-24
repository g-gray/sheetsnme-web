import * as t from './types'

import * as u from './utils'
import * as n from './net'

export const RECEIVE_CATEGORIES     = 'RECEIVE_CATEGORIES'
export const RECEIVE_PAYEES         = 'RECEIVE_PAYEES'
export const RECEIVE_TRANSACTIONS   = 'RECEIVE_TRANSACTIONS'



export type DomActions =
  AddNotification |
  RemoveNotification |
  Resize |
  NextLang |
  AddDialog |
  RemoveDialog



export const RESIZE = 'RESIZE'

export interface Resize extends t.AppAction {
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


export const ADD_DIALOG = 'ADD_DIALOG'

export interface AddDialog<P = any> extends t.AppAction {
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

export interface RemoveDialog extends t.AppAction {
  type: typeof REMOVE_DIALOG,
}

export function removeDialog(): RemoveDialog {
  return {
    type: REMOVE_DIALOG,
  }
}



export const NEXT_LANG = 'NEXT_LANG'

export interface NextLang extends t.AppAction {
  type: typeof NEXT_LANG,
  payload: {
    lang: t.LANG,
  },
}

export function nextLang(lang: t.LANG): t.AppThunk<NextLang> {
  return (dispatch) => {
    u.storageWrite(['lang'], lang)
    return dispatch({
      type: NEXT_LANG,
      payload: {
        lang,
      },
    })
  }
}

/**
 * Notifications
 */

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'

export interface AddNotification extends t.AppAction {
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

export interface RemoveNotification extends t.AppAction {
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
  ReceiveAccounts |
  ReceiveUser

/**
 * Request tracking
 */

function trackRequest<P>(opts: {message: string, requestName: string, promise: Promise<P>}): t.AppThunk<Promise<P>> {
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

export interface RequestStartAction extends t.AppAction {
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

export interface RequestEndAction extends t.AppAction {
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

export function fetchUser(message: string): t.AppThunk<Promise<ReceiveUser>> {
  return (dispatch) => {
    return dispatch(trackRequest<t.UserRes>({
      message,
      requestName: 'getUser',
      promise: n.authedJsonFetch('/api/user'),
    }))
      .then(user => dispatch(receiveUser(user)))
  }
}


export const fetchCategories  = message => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'getCategories',
    promise: n.authedJsonFetch('/api/categories'),
  }))
    .then(categories => dispatch({type: RECEIVE_CATEGORIES, categories}))
}

export const createCategory = (category, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'postCategory',
    promise: n.authedJsonFetch('/api/categories', {
      method: 'POST',
      body: category,
    }),
  }))
}

export const updateCategory = (id, category, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'postCategory',
    promise: n.authedJsonFetch(`/api/categories/${id}`, {
      method: 'POST',
      body: category,
    }),
  }))
}

export const deleteCategory = (id, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'deleteCategory',
    promise: n.authedJsonFetch(`/api/categories/${id}`, {
      method: 'DELETE',
    }),
  }))
}

export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS'

export interface ReceiveAccounts extends t.AppAction {
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

export function fetchAccounts(message: string): t.AppThunk<Promise<ReceiveAccounts>> {
  return (dispatch) => {
    return dispatch(trackRequest<t.AccountListRes>({
      message,
      requestName: 'getAccounts',
      promise: n.authedJsonFetch<t.AccountListRes>('/api/accounts'),
    }))
      .then(accounts => dispatch(receiveAccounts(accounts)))
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


export const fetchPayees  = message => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'getPayees',
    promise: n.authedJsonFetch('/api/payees'),
  }))
    .then(payees => dispatch({type: RECEIVE_PAYEES, payees}))
}

export const createPayee = (payee, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'postPayee',
    promise: n.authedJsonFetch('/api/payees', {
      method: 'POST',
      body: payee,
    }),
  }))
}

export const updatePayee = (id, payee, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'postPayee',
    promise: n.authedJsonFetch(`/api/payees/${id}`, {
      method: 'POST',
      body: payee,
    }),
  }))
}

export const deletePayee = (id, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'deletePayee',
    promise: n.authedJsonFetch(`/api/payees/${id}`, {
      method: 'DELETE',
    }),
  }))
}


export const fetchTransactions = (location, message) => dispatch => {
  const query = u.decodeQuery(location.search)

  return dispatch(trackRequest({
    message,
    requestName: 'getTransactions',
    promise: n.authedJsonFetch('/api/transactions', {
      method: 'GET',
      body: {
        ...query,
        offset: u.DEFAULT_PAGE_SIZE * ((query.page || 1) - 1),
        limit: u.DEFAULT_PAGE_SIZE,
      },
    }),
  }))
    .then(transactions => dispatch({type: RECEIVE_TRANSACTIONS, transactions}))
}

export const createTransaction = (transaction, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'postTransaction',
    promise: n.authedJsonFetch('/api/transactions', {
      method: 'POST',
      body: transaction,
    }),
  }))
}

export const updateTransaction = (id, transaction, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'postTransaction',
    promise: n.authedJsonFetch(`/api/transactions/${id}`, {
      method: 'POST',
      body: transaction,
    }),
  }))
}

export const deleteTransaction = (id, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'deleteTransaction',
    promise: n.authedJsonFetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    }),
  }))
}
