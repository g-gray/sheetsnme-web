import * as t from './types'

import * as u from '../utils'

import * as a from './actions'

export const defaultState: t.TransactionsState = {
  transactionList: {
    limit        : 0,
    offset       : 0,
    total        : 0,
    items        : [],
    outcomeAmount: 0,
    incomeAmount : 0,
  },
  transactionsById: {},
}

export const transactions = (
  state = defaultState,
  action: a.TransactionActions
) => {
  switch (action.type) {
    case a.RECEIVE_TRANSACTIONS: {
      const {transactionList} = action.payload
      return {
        ...state,
        transactionList,
        transactionsById: u.keyById(transactionList.items),
      }
    }

    default:
      return state
  }
}
