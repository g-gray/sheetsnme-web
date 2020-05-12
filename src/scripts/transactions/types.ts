export type TransactionsState = {
  transactionList: TransactionListRes,
  transactionsById: TransactionsById,
}

export type TransactionReq = {
  id?              : string,
  type             : TRANSACTION_TYPE,
  date             : string,
  categoryId?      : string,
  payeeId?         : string,
  comment?         : string,
  outcomeAccountId?: string,
  outcomeAmount?   : number,
  incomeAccountId? : string,
  incomeAmount?    : number,
  createdAt?       : string,
  updatedAt?       : string,
}

export type TransactionRes = {
  id              : string,
  type            : TRANSACTION_TYPE,
  date            : string,
  categoryId      : string,
  payeeId         : string,
  comment         : string,
  outcomeAccountId: string,
  outcomeAmount   : number,
  incomeAccountId : string,
  incomeAmount    : number,
  createdAt       : string,
  updatedAt       : string,
}

export enum TRANSACTION_TYPE {
  OUTCOME  = 'OUTCOME',
  INCOME   = 'INCOME',
  TRANSFER = 'TRANSFER',
  LOAN     = 'LOAN',
  BORROW   = 'BORROW',
}

export type TransactionListRes = {
  limit        : number,
  offset       : number,
  total        : number,
  items        : TransactionRes[],
  outcomeAmount: number,
  incomeAmount : number,
}

export type TransactionsById = {
  [key: string]: TransactionRes,
}

export type TransactionsFilter = {
  id?        : string,
  dateFrom?  : string,
  dateTo?    : string,
  categoryId?: string,
  payeeId?   : string,
  comment?   : string,
  accountId? : string,
  amountFrom?: string,
  amountTo?  : string,
  limit?     : string,
  offset?    : string,
}

export type TransactionsFilterForm = {
  dateFrom  : void | Date,
  dateTo    : void | Date,
  accountId : string,
  categoryId: string,
  payeeId   : string,
  comment   : string,
}
