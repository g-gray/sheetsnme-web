export type PayeesState = {
  payeeList: PayeeListRes,
  payeesById: PayeesById,
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
