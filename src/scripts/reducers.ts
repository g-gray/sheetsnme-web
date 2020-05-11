import * as t from './types'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from './actions'

import * as penr from './pending/reducers'

import * as ur from './user/reducers'

import * as cr from './categories/reducers'
import * as ar from './accounts/reducers'
import * as pr from './payees/reducers'

const defaultNetState: t.NetState = {
  pending: penr.defaultState,
  user: ur.defaultState,
  categories: cr.defaultState,
  accounts: ar.defaultState,
  payees: pr.defaultState,
  transactions: {},
  transactionsById: {},
}

export const net = (state = defaultNetState, action: a.NetAction) => {
  switch (action.type) {
    case a.REQUEST_START:
    case a.REQUEST_END: {
      return {
        ...state,
        pending: penr.pending(state.pending, action),
      }
    }

    case a.RECEIVE_USER: {
      return {
        ...state,
        user: ur.user(state.user, action),
      }
    }

    case a.RECEIVE_CATEGORIES: {
      return {
        ...state,
        categories: cr.categories(state.categories, action),
      }
    }

    case a.RECEIVE_ACCOUNTS: {
      return {
        ...state,
        accounts: ar.accounts(state.accounts, action),
      }
    }

    case a.RECEIVE_PAYEES: {
      return {
        ...state,
        payees: pr.payees(state.payees, action),
      }
    }

    case a.RECEIVE_TRANSACTIONS: {
      const {transactions} = action.payload
      return {
        ...state,
        transactions,
        transactionsById: fpx.keyBy(
          transactions.items,
          (transaction: t.TransactionRes) => transaction.id
        ),
      }
    }

    default:
      return state
  }
}
