import {Action, Dispatch} from 'redux'
import {ThunkAction} from 'redux-thunk'

export type AppState = DomState & NetState



/**
 * Dom
 */

export type DomState = {
  dialogs: [],
  notifications: NotificationList,
  geometry: {},
  lang: string,
}

export type Notification = {
  text: string,
  timeout?: number,
  time: number,
}

export type NotificationList = Notification[]



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

export interface AppDispatch extends Dispatch<AppAction> {}

export interface AppAction extends Action<string> {
  payload: any,
}
