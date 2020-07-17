export type PayeesState = {
  payeeList     : PayeeListRes,
  payeesById    : PayeesById,
  debtsByPayeeId: DebtsByPayeeId,
}

export type PayeeReq = {
  id?          : string,
  title        : string,
  createdAt?   : string,
  updatedAt?   : string,
}

export type PayeeRes = {
  id          : string,
  title       : string,
  createdAt   : string,
  updatedAt   : string,
}

export type PayeeWithDebtRes = PayeeRes & {
  debt: number,
}

export type PayeeListRes = PayeeWithDebtRes[]

export type PayeesById = {
  [key: string]: PayeeWithDebtRes,
}



/**
 * Debts
 */

export type PayeesDebtsRes = DebtsByPayeeId

export type DebtsByPayeeId = {
  [key: string]: Debt,
}

export type Debt = {
  payeeId: string,
  debt   : number,
}
