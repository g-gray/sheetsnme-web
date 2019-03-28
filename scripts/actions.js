import * as n from './net'
import * as u from './utils'
import * as m from './views/misc'

export const RESIZE                 = 'RESIZE'
export const SET_DIALOG             = 'SET_DIALOG'

export const REQUEST_TRANSACTIONS   = 'REQUEST_TRANSACTIONS'
export const RECEIVE_TRANSACTIONS   = 'RECEIVE_TRANSACTIONS'
export const REQUEST_TRANSACTION    = 'REQUEST_TRANSACTION'
export const RECEIVE_TRANSACTION    = 'RECEIVE_TRANSACTION'
export const POST_TRANSACTION       = 'POST_TRANSACTION'

export const REQUEST_ERROR          = 'REQUEST_ERROR'

export const resize = geometry => ({
  type: RESIZE,
  geometry,
})

export const setDialog = dialog => ({
  type: SET_DIALOG,
  dialog,
})

export const openDialog = dialog => (dispatch, getState) => {
  dispatch(setDialog(dialog))
  const {dom: {dialogs}} = getState()
  m.onDialogSet(dialogs)
}

export const requestTransactions = () => ({
  type: REQUEST_TRANSACTIONS,
})

export const receiveTransactions = transactions => ({
  type: RECEIVE_TRANSACTIONS,
  transactions,
})

export const fetchTransactions = () => dispatch => {
  dispatch(requestTransactions())
  n.authedJsonFetch('/api/transactions')
    .then(transactions => dispatch(receiveTransactions(transactions)))
    .catch(error => dispatch(requestError(error)))
}

export const receiveTransaction = transaction => ({
  type: RECEIVE_TRANSACTION,
  transaction,
})

export const postTransaction = () => ({
  type: POST_TRANSACTION,
})

export const createTransaction = transaction => dispatch => {
  dispatch(postTransaction())
  n.authedJsonFetch('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(u.formatTransaction(transaction)),
  })
    .then(() => dispatch(receiveTransaction()))
    .then(() => dispatch(fetchTransactions()))
    .catch(error => dispatch(requestError(error)))
}

export const requestError = error => ({
  type: REQUEST_ERROR,
  error,
})
