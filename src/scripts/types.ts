import React from 'react'
import {Action, Dispatch} from 'redux'
import {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {ParsedUrlQuery, ParsedUrlQueryInput} from 'querystring'
import {History, Location} from 'history'
import {RouteComponentProps} from 'react-router-dom'

import * as gt from './geometry/types'
export * from './geometry/types'

import * as i18nt from './i18n/types'
export * from './i18n/types'

import * as nt from './notifications/types'
export * from './notifications/types'

import * as dt from './dialogs/types'
export * from './dialogs/types'

import * as pent from './pending/types'
export * from './pending/types'

import * as ut from './user/types'
export * from './user/types'

import * as ct from './categories/types'
export * from './categories/types'

import * as at from './accounts/types'
export * from './accounts/types'

import * as pt from './payees/types'
export * from './payees/types'

import * as tt from './transactions/types'
export * from './transactions/types'

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
  lang    : i18nt.LANG,
}



/**
 * React
 */

export type RFormEventHandler = React.FormEventHandler
export type RMouseEventHandler = React.MouseEventHandler
export type RKeyboardEventHandler = React.KeyboardEventHandler

export type REvent = React.SyntheticEvent
export type RFormEvent = React.FormEvent
export type RMouseEvent = React.MouseEvent
export type RChangeEvent = React.ChangeEvent
export type RKeyboardEvent = React.KeyboardEvent

export type RReactElement = React.ReactElement
export type RComponentType<P> = React.ComponentType<P>
export type RReactInstance = React.ReactInstance
export type RReactChildren = React.ReactNode | React.ReactNode[]

export type RCSSProperties = React.CSSProperties
export type RSVGProps = React.SVGProps<SVGSVGElement>



/**
 * React Router
 */

export type RRHistory = History
export type RRLocation = Location

export type RRRouteComponentProps = RouteComponentProps



/**
 * Redux Thunk
 */

export type AppThunkAction<R = void> = ThunkAction<
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




/**
 * Redux
 */

export interface AppDispatch extends Dispatch<AppAction> {}

export interface AppAction extends Action<string> {
  payload?: any,
}

export type AppState = {
  dom: {
    geometry     : gt.GeometryState,
    i18n         : i18nt.i18nState,
    notifications: nt.NotificationsState,
    dialogs      : dt.DialogsState,
  },
  net: {
    pending     : pent.Pending,
    user        : ut.UserState,
    categories  : ct.CategoriesState,
    accounts    : at.AccountsState,
    payees      : pt.PayeesState,
    transactions: tt.TransactionsState,
  },
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
 * Errors
 */

export type ValidationError = {
  text: string,
}



/**
 * Utils
 */

export type Path = (string | number)[]

export type BindValueProps = {
  onUpdate: (value: any) => void,
  value: any,
}

export type BindCheckedProps = {
  onUpdate: (value: any) => void,
  value: any,
  checked: boolean,
}

export type BgImgStyles = {
  backgroundImage: string,
}

export type Dict = {
  [key: string]: any,
}
