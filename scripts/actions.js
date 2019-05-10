import * as u from './utils'
import * as n from './net'

export const RESIZE                 = 'RESIZE'
export const ADD_DIALOG             = 'ADD_DIALOG'
export const REMOVE_DIALOG          = 'REMOVE_DIALOG'

export const ADD_NOTIFICATION       = 'ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION    = 'REMOVE_NOTIFICATION'

export const RECEIVE_USER           = 'RECEIVE_USER'

export const RECEIVE_TRANSACTIONS   = 'RECEIVE_TRANSACTIONS'
export const RECEIVE_TRANSACTION    = 'RECEIVE_TRANSACTION'

export const RECEIVE_CATEGORIES     = 'RECEIVE_CATEGORIES'
export const RECEIVE_CATEGORY       = 'RECEIVE_CATEGORY'

export const RECEIVE_ACCOUNTS       = 'RECEIVE_ACCOUNTS'
export const RECEIVE_ACCOUNT        = 'RECEIVE_ACCOUNT'

export const RECEIVE_PAYEES         = 'RECEIVE_PAYEES'
export const RECEIVE_PAYEE          = 'RECEIVE_PAYEE'

export const REQUEST_START          = 'REQUEST_START'
export const REQUEST_END            = 'REQUEST_END'

export const NEXT_LANG              = 'NEXT_LANG'



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



export const notify = notification => ({
  type: ADD_NOTIFICATION,
  notification: createNotification(notification),
})

export const removeNotification = time => ({
  type: REMOVE_NOTIFICATION,
  time,
})

function createNotification({timeout = 4000, ...props}) {
  return {
    timeout,
    time: new Date().getTime(),
    ...props,
  }
}


export const nextLang = lang => dispatch => {
  u.storageWrite(['lang'], lang)
  dispatch({
    type: NEXT_LANG,
    lang,
  })
}



export const init = () => dispatch => {
  return dispatch(fetchUser())
    .then(() => Promise.all([
      dispatch(fetchCategories()),
      dispatch(fetchAccounts()),
      dispatch(fetchPayees()),
    ]))
    .then(() => dispatch(fetchTransactions()))
}


export const fetchUser = () => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Fetching user data...',
    requestName: 'getUser',
    promise: n.authedJsonFetch('/api/user'),
  })
    .then(user => dispatch({type: RECEIVE_USER, user}))
}


export const fetchTransactions = () => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Fetching transactions...',
    requestName: 'getTransactions',
    promise: n.authedJsonFetch('/api/transactions'),
  })
    .then(transactions => dispatch({type: RECEIVE_TRANSACTIONS, transactions}))
}

export const createTransaction = transaction => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Saving...',
    requestName: 'postTransaction',
    promise: n.authedJsonFetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    }),
  })
}

export const updateTransaction = (transaction, id) => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Saving...',
    requestName: 'postTransaction',
    promise: n.authedJsonFetch(`/api/transactions/${id}`, {
      method: 'POST',
      body: JSON.stringify(transaction),
    }),
  })
}

export const deleteTransaction = id => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Deleting...',
    requestName: 'deleteTransaction',
    promise: n.authedJsonFetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    }),
  })
}

export const receiveTransaction = transaction => ({
  type: RECEIVE_TRANSACTION,
  transaction,
})


export const fetchCategories  = () => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Fetching categories...',
    requestName: 'getCategories',
    promise: n.authedJsonFetch('/api/categories'),
  })
    .then(categories => dispatch({type: RECEIVE_CATEGORIES, categories}))
}

export const createCategory = category => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Saving...',
    requestName: 'postCategory',
    promise: n.authedJsonFetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),
  })
}

export const updateCategory = (category, id) => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Saving...',
    requestName: 'postCategory',
    promise: n.authedJsonFetch(`/api/categories/${id}`, {
      method: 'POST',
      body: JSON.stringify(category),
    }),
  })
}

export const deleteCategory = id => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Deleting...',
    requestName: 'deleteCategory',
    promise: n.authedJsonFetch(`/api/categories/${id}`, {
      method: 'DELETE',
    }),
  })
}

export const receiveCategory = category => ({
  type: RECEIVE_CATEGORY,
  category,
})


export const fetchAccounts  = () => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Fetching accounts...',
    requestName: 'getAccounts',
    promise: n.authedJsonFetch('/api/accounts'),
  })
    .then(accounts => dispatch({type: RECEIVE_ACCOUNTS, accounts}))
}

export const createAccount = account => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Saving...',
    requestName: 'postAccount',
    promise: n.authedJsonFetch('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    }),
  })
}

export const updateAccount = (account, id) => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Saving...',
    requestName: 'postAccount',
    promise: n.authedJsonFetch(`/api/accounts/${id}`, {
      method: 'POST',
      body: JSON.stringify(account),
    }),
  })
}

export const deleteAccount = id => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Deleting...',
    requestName: 'deleteAccount',
    promise: n.authedJsonFetch(`/api/accounts/${id}`, {
      method: 'DELETE',
    }),
  })
}

export const receiveAccount = account => ({
  type: RECEIVE_ACCOUNT,
  account,
})


export const fetchPayees  = () => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Fetching payees...',
    requestName: 'getPayees',
    promise: n.authedJsonFetch('/api/payees'),
  })
    .then(payees => dispatch({type: RECEIVE_PAYEES, payees}))
}

export const createPayee = payee => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Saving...',
    requestName: 'postPayee',
    promise: n.authedJsonFetch('/api/payees', {
      method: 'POST',
      body: JSON.stringify(payee),
    }),
  })
}

export const updatePayee = (payee, id) => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Saving...',
    requestName: 'postPayee',
    promise: n.authedJsonFetch(`/api/payees/${id}`, {
      method: 'POST',
      body: JSON.stringify(payee),
    }),
  })
}

export const deletePayee = id => dispatch => {
  return trackRequest({
    dispatch,
    message: 'Deleting...',
    requestName: 'deletePayee',
    promise: n.authedJsonFetch(`/api/payees/${id}`, {
      method: 'DELETE',
    }),
  })
}

export const receivePayee = payee => ({
  type: RECEIVE_PAYEE,
  payee,
})


function trackRequest({dispatch, message, requestName, promise}) {
  const {notification: {time}} = dispatch(notify({text: message, timeout: 0}))
  dispatch(requestStart({[requestName]: true}))

  return promise
    .then(response => {
      dispatch(requestEnd(requestName))
      if (time) dispatch(removeNotification(time))
      return response
    })
    .catch(response => {
      dispatch(requestEnd(requestName))
      if (time) dispatch(removeNotification(time))
      return Promise.reject(response)
    })
}

const requestStart = request => ({
  type: REQUEST_START,
  request,
})

const requestEnd = name => ({
  type: REQUEST_END,
  name,
})
