import * as t from './types'

import * as u from './utils'
import * as n from './net'

export const RESIZE                 = 'RESIZE'
export const ADD_DIALOG             = 'ADD_DIALOG'
export const REMOVE_DIALOG          = 'REMOVE_DIALOG'

export const RECEIVE_USER           = 'RECEIVE_USER'
export const RECEIVE_CATEGORIES     = 'RECEIVE_CATEGORIES'
export const RECEIVE_ACCOUNTS       = 'RECEIVE_ACCOUNTS'
export const RECEIVE_PAYEES         = 'RECEIVE_PAYEES'
export const RECEIVE_TRANSACTIONS   = 'RECEIVE_TRANSACTIONS'

export const REQUEST_START          = 'REQUEST_START'
export const REQUEST_END            = 'REQUEST_END'

export const NEXT_LANG              = 'NEXT_LANG'



export type DomActions = AddNotification | RemoveNotification

export const resize = geometry => ({
  type: RESIZE,
  geometry,
})



export const addDialog = (dialog, props) => ({
  type: ADD_DIALOG,
  dialog,
  props,
})

export const removeDialog = () => ({
  type: REMOVE_DIALOG,
})




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



export const nextLang = lang => dispatch => {
  u.storageWrite(['lang'], lang)
  dispatch({
    type: NEXT_LANG,
    lang,
  })
}
export type NetAction = RequestStartAction | RequestEndAction

/**
 * Request tracking
 */

function trackRequest<P>(opts: {message: string, requestName: string, promise: Promise<any>}): t.AppThunk<Promise<P>> {
  return (dispatch: t.AppDispatch): Promise<P> => {
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



export const fetchUser = message => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'getUser',
    promise: n.authedJsonFetch('/api/user'),
  }))
    .then(user => dispatch({type: RECEIVE_USER, user}))
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


export const fetchAccounts  = message => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'getAccounts',
    promise: n.authedJsonFetch('/api/accounts'),
  }))
    .then(accounts => dispatch({type: RECEIVE_ACCOUNTS, accounts}))
}

export const createAccount = (account, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'postAccount',
    promise: n.authedJsonFetch('/api/accounts', {
      method: 'POST',
      body: account,
    }),
  }))
}

export const updateAccount = (id, account, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'postAccount',
    promise: n.authedJsonFetch(`/api/accounts/${id}`, {
      method: 'POST',
      body: account,
    }),
  }))
}

export const deleteAccount = (id, message) => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'deleteAccount',
    promise: n.authedJsonFetch(`/api/accounts/${id}`, {
      method: 'DELETE',
    }),
  }))
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
