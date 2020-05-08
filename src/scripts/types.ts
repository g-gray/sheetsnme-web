import React from 'react'
import {Action, Dispatch} from 'redux'
import {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {ParsedUrlQuery, ParsedUrlQueryInput} from 'querystring'
import {Location} from 'history'

import * as gt from './geometry/types'
export * from './geometry/types'

import * as i18nt from './i18n/types'
export * from './i18n/types'

import * as nt from './notifications/types'
export * from './notifications/types'

import * as dt from './dialogs/types'
export * from './dialogs/types'

import * as pt from './pending/types'
export * from './pending/types'
/**
 * Env
 */

declare global {
  interface Window {
    VARS: {
      PROD            : boolean,
      COMMIT          : string,
      LANG_HEADER_NAME: string,
    }
  }
}

export type AppContext = {
  isMobile: boolean,
  lang: i18nt.LANG,
}

export type AppState = {
  dom: DomState,
  net: NetState,
}

export type RFormEvent = React.FormEvent
export type RMouseEvent = React.MouseEvent
export type RChangeEvent = React.ChangeEvent




/**
 * Dom
 */

export type DomState = {
  geometry: gt.GeometryState,
  i18n: i18nt.i18nState,
  notifications: nt.NotificationsState,
  dialogs: dt.DialogsState,
}

export type BgUrl = {
  backgroundImage: string,
}

export type Dict = {
  [key: string]: any,
}



/**
 * Net
 */

export type NetState = {
  user: UserRes,
  transactions: {},
  transactionsById: {},
  categories: CategoryListRes,
  categoriesById: CategoriesById,
  accounts: AccountListRes,
  accountsById: AccountsById,
  payees: [],
  payeesById: {},
  pending: pt.Pending,
}



export type AppThunk<R = void> = ThunkAction<
  R,
  AppState,
  unknown,
  AppAction
>

export type AppThunkDispatch = ThunkDispatch<
  AppState,
  unknown,
  AppAction
>

export interface AppDispatch extends Dispatch<AppAction> {}

export interface AppAction extends Action<string> {
  payload?: any,
}

export type RLocation = Location



/**
 * Querystring
 */

export type DecodedQuery = ParsedUrlQuery
export type DecodedQueryInput = ParsedUrlQueryInput


/**
 * XHttp
 */

export type JsonParams = {
  method? : string,
  headers?: {[key: string]: string},
  timeout?: number,
  body?   : any,
}

export type XHttpParams = {
  url     : string,
  method? : string,
  headers?: {[key: string]: string},
  timeout?: number,
  body?   : any,
}

export type XHttpResponse = {
  ok        : boolean,
  status    : string,
  statusText: string,
  reason    : string,
  headers   : {[key: string]: string},
  body      : any,
  params    : XHttpParams,
}



/**
 * Utils
 */

export type Path = (string | number)[]

export type BindValue = {
  onUpdate: (value: any) => void,
  value: any,
}

export type BindChecked = {
  onUpdate: (value: any) => void,
  value: any,
  checked: boolean,
}



/**
 * User
 */

export type UserRes = {
  id           : string,
  pictureUrl   : string,
  email        : string,
  firstName    : string,
  lastName     : string,
  spreadsheets : SpreadsheetRes[],
  createdAt    : Date,
  updatedAt    : Date,
}

export type SpreadsheetRes = {
  id: string,
}



/**
 * Account
 */

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
 * Category
 */

export type CategoryReq = {
  id?          : string,
  title        : string,
  createdAt?   : string,
  updatedAt?   : string,
}

export type CategoryRes = {
  id          : string,
  title       : string,
  createdAt   : string,
  updatedAt   : string,
}

export type CategoryListRes = CategoryRes[]

export type CategoriesById = {
  [key: string]: CategoryRes,
}



/**
 * Payee
 */

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
 * Transaction
 */

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
  limit: number,
  offset: number,
  total: number,
  items: TransactionRes[],
  outcomeAmount: number,
  incomeAmount: number,
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



/**
 * Errors
 */

export type ValidationError = {
  text: string,
}
