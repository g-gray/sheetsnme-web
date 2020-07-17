import * as t from './types'

import * as u from '../utils'

import * as a from './actions'

export const defaultState: t.PayeesState = {
  payeeList: [],
  payeesById: {},
  debtsByPayeeId: {},
}

export const payees = (
  state = defaultState,
  action: a.PayeeActions
) => {
  switch (action.type) {
    case a.RECEIVE_PAYEES: {
      const {payeeList} = action.payload
      return {
        ...state,
        payeeList,
        payeesById: u.keyById(payeeList),
      }
    }

    case a.RECEIVE_PAYEES_DEBTS: {
      const {payeesDebts} = action.payload
      return {
        ...state,
        debtsByPayeeId: payeesDebts,
      }
    }

    default:
      return state
  }
}
