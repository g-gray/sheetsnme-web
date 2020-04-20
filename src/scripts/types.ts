import {Action, Dispatch} from 'redux'
import {ThunkAction, ThunkDispatch} from 'redux-thunk'

export type AppContext = {} | {
  lang: LANG,
}

export type AppState = {
  dom: DomState,
  net: NetState,
}



/**
 * Dom
 */

export type DomState = {
  dialogs: [],
  notifications: NotificationList,
  geometry: {},
  lang: LANG,
}

export type Notification = {
  text: string,
  timeout?: number,
  time: number,
}

export type NotificationList = Notification[]

export enum LANG {
  en = 'en',
  ru = 'ru',
}




/**
 * Net
 */

export type NetState = {
  user: {},
  transactions: {},
  transactionsById: {},
  categories: [],
  categoriesById: {},
  accounts: AccountListRes,
  accountsById: AccountsById,
  payees: [],
  payeesById: {},
  pending: Pending,
}

export type Pending = {
  [key: string]: boolean,
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
  payload: any,
}

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
 * Accounts
 */

export type AccountReq = {
  id?          : string,
  title        : string,
  currencyCode?: string,
  balance?     : number,
  createdAt?   : string,
  updatedAt?   : string,
}

export type AccountRes = {
  id          : string,
  title       : string,
  currencyCode: string,
  balance     : number,
  createdAt   : string,
  updatedAt   : string,
}

export type AccountListRes = AccountRes[]

export type AccountsById = {
  [key: string]: AccountRes,
}
