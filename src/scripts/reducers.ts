import * as t from './types'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from './actions'

import * as pr from './pending/reducers'
import * as cr from './categories/reducers'
import * as ar from './accounts/reducers'

const defaultNetState: t.NetState = {
  user: {},
  transactions: {},
  transactionsById: {},
  categories: cr.defaultState,
  accounts: ar.defaultState,
  payees: [],
  payeesById: {},
  pending: pr.defaultState,
}

export const net = (state = defaultNetState, action: a.NetAction) => {
  switch (action.type) {
    case a.RECEIVE_USER: {
      const {user} = action.payload
      return {
        ...state,
        user,
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
      const {payees} = action.payload
      return {
        ...state,
        payees,
        payeesById: fpx.keyBy(payees, (payee: t.PayeeRes) => payee.id),
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

    case a.REQUEST_START:
    case a.REQUEST_END: {
      return {
        ...state,
        pending: pr.pending(state.pending, action),
      }
    }

    default:
      return state
  }
}
