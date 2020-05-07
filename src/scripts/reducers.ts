import * as t from './types'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from './actions'


const defaultNetState: t.NetState = {
  user: {},
  transactions: {},
  transactionsById: {},
  categories: [],
  categoriesById: {},
  accounts: [],
  accountsById: {},
  payees: [],
  payeesById: {},
  pending: {},
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
      const {categories} = action.payload
      return {
        ...state,
        categories,
        categoriesById: fpx.keyBy(categories, (category: t.CategoryRes) => category.id),
      }
    }

    case a.RECEIVE_ACCOUNTS: {
      const {accounts} = action.payload
      return {
        ...state,
        accounts,
        accountsById: fpx.keyBy(accounts, (account: t.AccountRes) => account.id),
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
      return {
        ...state,
        pending: {
          ...state.pending,
          [action.payload.requestName]: true,
        },
      }
    case a.REQUEST_END:
      return {
        ...state,
        pending: fpx.omitBy(
          state.pending,
          (__: boolean, requestName: string) => {
            return requestName === action.payload.requestName
          }
        ),
      }

    default:
      return state
  }
}
