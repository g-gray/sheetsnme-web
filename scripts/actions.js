import * as u from './utils'
import * as n from './net'

export const RESIZE                 = 'RESIZE'
export const ADD_DIALOG             = 'ADD_DIALOG'
export const REMOVE_DIALOG          = 'REMOVE_DIALOG'

export const ADD_NOTIFICATION       = 'ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION    = 'REMOVE_NOTIFICATION'

export const RECEIVE_USER           = 'RECEIVE_USER'
export const RECEIVE_TRANSACTIONS   = 'RECEIVE_TRANSACTIONS'
export const RECEIVE_CATEGORIES     = 'RECEIVE_CATEGORIES'
export const RECEIVE_ACCOUNTS       = 'RECEIVE_ACCOUNTS'
export const RECEIVE_PAYEES         = 'RECEIVE_PAYEES'

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



const trackRequest = ({message, requestName, promise}) => dispatch => {
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
      throw response
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



export const fetchUser = message => dispatch => {
  return dispatch(trackRequest({
    message,
    requestName: 'getUser',
    promise: n.authedJsonFetch('/api/user'),
  }))
    .then(user => dispatch({type: RECEIVE_USER, user}))
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
