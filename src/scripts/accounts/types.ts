export type AccountsState = {
  accountList        : AccountListRes,
  accountsById       : AccountsById,
  balancesByAccountId: BalancesByAccountId,
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



/**
 * Balances
 */

export type AccountsBalancesRes = BalancesByAccountId

export type BalancesByAccountId = {
  [key: string]: Balance,
}

export type Balance = {
  accountId: string,
  balance  : number,
}
