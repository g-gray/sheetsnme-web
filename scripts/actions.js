import * as n from './net'

export const resize = geometry => ({
  type: 'RESIZE',
  geometry,
})

export const fetchTransactionsRequest = () => ({
  type: 'FETCH_TRANSACTIONS',
})

export const fetchTransactionsError = error => ({
  type: 'FETCH_TRANSACTIONS',
  status: 'error',
  error,
})

export const fetchTransactionsSuccess = transactions => ({
  type: 'FETCH_TRANSACTIONS',
  status: 'success',
  transactions,
})

export const fetchTransactionsData = () => (
  dispatch => {
    dispatch(fetchTransactionsRequest())
    n.authedJsonFetch('/api/transactions')
      .then(transactions => dispatch(fetchTransactionsSuccess(transactions)))
      .catch(error => dispatch(fetchTransactionsError(error)))
  }
)
