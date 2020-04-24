import {Action, Dispatch} from 'redux'
import {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {ParsedUrlQuery, ParsedUrlQueryInput} from 'querystring'

/**
 * Env
 */

export type Vars = {

}

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
  dialogs: DialogList,
  notifications: NotificationList,
  geometry: Geometry,
  lang: LANG,
}

export type Dialog<P> = {
  dialog: React.Component<P>,
  dialogProps?: P,
}

export type DialogList = Dialog<any>[]

export type Notification = {
  text: string,
  timeout?: number,
  time: number,
}

export type NotificationList = Notification[]

export type Geometry = {
  isMobile: boolean,
}

export enum LANG {
  en = 'en',
  ru = 'ru',
}

export type Translation = string | ((...args: any[]) => string)

export type Translations = {
  [key in LANG]: Translation
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
  payload?: any,
}



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
