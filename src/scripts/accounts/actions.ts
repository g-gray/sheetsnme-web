import * as t from '../types'

import * as n from '../net'
import * as pa from '../pending/actions'

export type AccountActions = ReceiveAccounts | ReceiveAccountsBalances


export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS'

interface ReceiveAccounts extends t.ReduxAction {
  type: typeof RECEIVE_ACCOUNTS,
  payload: {
    accountList: t.AccountListRes,
  },
}

export function receiveAccounts(
  accountList: t.AccountListRes
): ReceiveAccounts {
  return {
    type: RECEIVE_ACCOUNTS,
    payload: {
      accountList,
    },
  }
}


export function fetchAccounts(
  message: string
): t.ReduxThunkAction<Promise<t.AccountListRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
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
): t.ReduxThunkAction<Promise<t.AccountRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
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
): t.ReduxThunkAction<Promise<t.AccountRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
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
): t.ReduxThunkAction<Promise<t.AccountRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'deleteAccount',
      promise: n.authedJsonFetch<t.AccountRes>(`/api/accounts/${id}`, {
        method: 'DELETE',
      }),
    }))
  }
}



/**
 * Balances
 */

export const RECEIVE_ACCOUNTS_BALANCES = 'RECEIVE_ACCOUNTS_BALANCES'

interface ReceiveAccountsBalances extends t.ReduxAction {
  type: typeof RECEIVE_ACCOUNTS_BALANCES,
  payload: {
    accountsBalances: t.AccountsBalancesRes,
  },
}

export function receiveAccountsBalances(
  accountsBalances: t.AccountsBalancesRes
): ReceiveAccountsBalances {
  return {
    type: RECEIVE_ACCOUNTS_BALANCES,
    payload: {
      accountsBalances,
    },
  }
}


export function fetchAccountsBalances(
  message: string
): t.ReduxThunkAction<Promise<t.AccountsBalancesRes>> {
  return (dispatch) => {
    return dispatch(pa.trackRequest({
      message,
      requestName: 'getAccountsBalances',
      promise: n.authedJsonFetch<t.AccountsBalancesRes>('/api/accounts/balances'),
    }))
      .then((accountsBalances) => {
        dispatch(receiveAccountsBalances(accountsBalances))
        return accountsBalances
      })
  }
}
