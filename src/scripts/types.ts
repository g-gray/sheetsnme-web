import React from 'react'
import {Action} from 'redux'
import {ThunkAction} from 'redux-thunk'
import {ParsedUrlQuery, ParsedUrlQueryInput} from 'querystring'
import {History, Location} from 'history'
import {RouteComponentProps} from 'react-router-dom'

export * from './env'
import * as et from './env'

export * from './geometry/types'
export * from './i18n/types'
export * from './notifications/types'
export * from './dialogs/types'
export * from './pending/types'

export * from './user/types'
export * from './categories/types'
export * from './accounts/types'
export * from './payees/types'
export * from './transactions/types'

/**
 * React
 */

export type RFormEventHandler = React.FormEventHandler
export type RMouseEventHandler = React.MouseEventHandler
export type RKeyboardEventHandler = React.KeyboardEventHandler

export type REvent = React.SyntheticEvent
export type RFormEvent = React.FormEvent
export type RMouseEvent = React.MouseEvent
export type RChangeEvent<T> = React.ChangeEvent<T>
export type RKeyboardEvent = React.KeyboardEvent

export type RReactElement<P = any> = React.ReactElement<P>
export type RComponentType<P> = React.ComponentType<P>
export type RReactInstance = React.ReactInstance
export type RReactNode = React.ReactNode
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
 * Redux
 */

export interface ReduxAction extends Action<string> {
  payload?: any,
}

export interface ReduxThunkAction<R> extends ThunkAction<
  R,
  et.AppState,
  unknown,
  ReduxAction
> {}



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

export type FetchError = ValidationError[]

export type ValidationError = {
  text: string,
}



/**
 * Utils
 */

export type Path = (number | string)[]

export type BgImgStyles = {
  backgroundImage: string,
}

export type Dict = {
  [key: string]: any,
}
