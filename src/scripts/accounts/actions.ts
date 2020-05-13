import * as t from '../types'

import * as n from '../net'
import * as pa from '../pending/actions'

export type AccountActions = ReceiveAccounts


export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS'

interface ReceiveAccounts extends t.AppAction {
  type: typeof RECEIVE_ACCOUNTS,
  payload: {
    accountList: t.AccountListRes,
  },
}

export function receiveAccounts(accountList: t.AccountListRes): ReceiveAccounts {
  return {
    type: RECEIVE_ACCOUNTS,
    payload: {
      accountList,
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
