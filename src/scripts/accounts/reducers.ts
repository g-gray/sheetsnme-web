import * as t from './types'

import * as u from '../utils'

import * as a from './actions'

export const defaultState: t.AccountsState = {
  accountList: [],
  accountsById: {},
  balancesByAccountId: {},
}

export const accounts = (
  state = defaultState,
  action: a.AccountActions
) => {
  switch (action.type) {
    case a.RECEIVE_ACCOUNTS: {
      const {accountList} = action.payload
      return {
        ...state,
        accountList,
        accountsById: u.keyById(accountList),
      }
    }

    case a.RECEIVE_ACCOUNTS_BALANCES: {
      const {accountsBalances} = action.payload
      return {
        ...state,
        balancesByAccountId: accountsBalances,
      }
    }

    default:
      return state
  }
}
