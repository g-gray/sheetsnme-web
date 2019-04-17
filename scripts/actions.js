import * as n from './net'

export const RESIZE                 = 'RESIZE'
export const SET_DIALOG             = 'SET_DIALOG'

export const ADD_NOTIFICATION       = 'ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION    = 'REMOVE_NOTIFICATION'

export const RECEIVE_USER           = 'RECEIVE_USER'

export const RECEIVE_CATEGORIES     = 'RECEIVE_CATEGORIES'
export const RECEIVE_CATEGORY       = 'RECEIVE_CATEGORY'

export const RECEIVE_ACCOUNTS       = 'RECEIVE_ACCOUNTS'
export const RECEIVE_ACCOUNT        = 'RECEIVE_ACCOUNT'

export const RECEIVE_PAYEES         = 'RECEIVE_PAYEES'
export const RECEIVE_PAYEE          = 'RECEIVE_PAYEE'

export const RECEIVE_TRANSACTIONS   = 'RECEIVE_TRANSACTIONS'
export const RECEIVE_TRANSACTION    = 'RECEIVE_TRANSACTION'

export const resize = geometry => ({
  type: RESIZE,
  geometry,
})

export const setDialog = (dialog, props) => ({
  type: SET_DIALOG,
  dialog,
  props,
})

export const notify = notification => ({
  type: ADD_NOTIFICATION,
  notification: createNotification(notification),
})

export const removeNotification = time => ({
  type: REMOVE_NOTIFICATION,
  time,
})

export const receiveTransaction = transaction => ({
  type: RECEIVE_TRANSACTION,
  transaction,
})

export const receiveCategory = category => ({
  type: RECEIVE_CATEGORY,
  category,
})

export const receiveAccount = account => ({
  type: RECEIVE_ACCOUNT,
  account,
})

export const receivePayee = payee => ({
  type: RECEIVE_PAYEE,
  payee,
})

export const init = () => dispatch => {
  dispatch(fetchUser())
    .then(() => window.Promise.all([
      dispatch(fetchCategories()),
      dispatch(fetchAccounts()),
      dispatch(fetchPayees()),
    ]))
    .then(() => dispatch(fetchTransactions()))
}

export const fetchUser = () => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Fetching user data...',
    url: '/api/user',
  })
    .then(user => dispatch({type: RECEIVE_USER, user}))
}

export const fetchCategories  = () => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Fetching categories...',
    url: '/api/categories',
  })
    .then(categories => dispatch({type: RECEIVE_CATEGORIES, categories}))
}

export const createCategory = category => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Saving...',
    url: '/api/categories',
    params: {
      method: 'POST',
      body: JSON.stringify(category),
    },
  })
}

export const updateCategory = (category, id) => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Saving...',
    url: `/api/categories/${id}`,
    params: {
      method: 'POST',
      body: JSON.stringify(category),
    },
  })
}

export const fetchAccounts  = () => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Fetching accounts...',
    url: '/api/accounts',
  })
    .then(accounts => dispatch({type: RECEIVE_ACCOUNTS, accounts}))
}

export const createAccount = account => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Saving...',
    url: '/api/accounts',
    params: {
      method: 'POST',
      body: JSON.stringify(account),
    },
  })
}

export const updateAccount = (account, id) => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Saving...',
    url: `/api/accounts/${id}`,
    params: {
      method: 'POST',
      body: JSON.stringify(account),
    },
  })
}

export const fetchPayees  = () => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Fetching payees...',
    url: '/api/payees',
  })
    .then(payees => dispatch({type: RECEIVE_PAYEES, payees}))
}

export const createPayee = payee => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Saving...',
    url: '/api/payees',
    params: {
      method: 'POST',
      body: JSON.stringify(payee),
    },
  })
}

export const updatePayee = (payee, id) => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Saving...',
    url: `/api/payees/${id}`,
    params: {
      method: 'POST',
      body: JSON.stringify(payee),
    },
  })
}

export const fetchTransactions = () => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Fetching transactions...',
    url: '/api/transactions',
  })
    .then(transactions => dispatch({type: RECEIVE_TRANSACTIONS, transactions}))
}

export const createTransaction = transaction => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Saving...',
    url: '/api/transactions',
    params: {
      method: 'POST',
      body: JSON.stringify(transaction),
    },
  })
}

export const updateTransaction = (transaction, id) => dispatch => {
  return authedNotifyingJsonFetch({
    dispatch,
    message: 'Saving...',
    url: `/api/transactions/${id}`,
    params: {
      method: 'POST',
      body: JSON.stringify(transaction),
    },
  })
}

function createNotification({timeout = 4000, ...props}) {
  return {
    timeout,
    time: new Date().getTime(),
    ...props,
  }
}

function authedNotifyingJsonFetch({dispatch, message, url, params}) {
  if (dispatch && message) {
    const {notification: {time}} = dispatch(notify({text: message, timeout: 0}))

    return n.authedJsonFetch(url, params)
      .then(response => {
        if (time) dispatch(removeNotification(time))
        return response
      })
      .catch(response => {
        if (time) dispatch(removeNotification(time))
        return window.Promise.reject(response)
      })
  }

  return n.authedJsonFetch(url, params)
}
