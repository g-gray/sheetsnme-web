export type AccountsState = {
  accountList: AccountListRes,
  accountsById: AccountsById,
}

export type AccountReq = {
  id?          : string,
  title        : string,
  currencyCode?: string,
  createdAt?   : string,
  updatedAt?   : string,
}

export type AccountRes = {
  id          : string,
  title       : string,
  currencyCode: string,
  createdAt   : string,
  updatedAt   : string,
}

export type AccountWithBalanceRes = AccountRes & {
  balance: number,
}

export type AccountListRes = AccountWithBalanceRes[]

export type AccountsById = {
  [key: string]: AccountWithBalanceRes,
}
