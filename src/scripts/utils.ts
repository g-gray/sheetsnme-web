import * as t from './types'

import React from 'react'
import ReactDom from 'react-dom'

// @ts-ignore
import * as f from 'fpx'
// @ts-ignore
import * as emerge from 'emerge'
import * as querystring from 'querystring'

export const DEFAULT_PAGE_SIZE = 25

export function findDomNode(instance: React.Component | Element): Element | Text | null {
  const element: Element | Text | null = ReactDom.findDOMNode(instance)
  if (element != null) f.validate(element, isElement)
  return element
}

function isComponent(value: any): boolean {
  return f.isInstance(value, React.Component)
}



export function bindValue(
  component: React.Component,
  path: t.Path,
  fun?: (value: any) => any
): t.BindValue {
  f.validate(component, isComponent)
  f.validate(path, isPath)

  return {
    onUpdate: (value: any): void => {
      component.setState(emerge.putIn(
        component.state,
        path,
        typeof fun === 'function' ? fun(value) : value
      ))
    },
    value: f.getIn(component.state, path) || '',
  }
}

export function bindChecked(
  component: React.Component,
  path: t.Path,
  value: any,
): t.BindChecked {
  f.validate(component, isComponent)
  f.validate(path, isPath)

  return {
    onUpdate: (value: any): void => {
      component.setState(emerge.putIn(component.state, path, value))
    },
    value,
    checked: f.getIn(component.state, path) === value,
  }
}



/**
 * Dom
 */

export function isNode(value: any): boolean {
  return f.isInstance(value, Node)
}

export function isElement(value: any): boolean {
  return f.isInstance(value, Element)
}

export function isAncestorOf(maybeAncestor: any, maybeDescendant: any): boolean {
  return (
    isNode(maybeAncestor) &&
    isNode(maybeDescendant) && (
      maybeAncestor === maybeDescendant ||
      isAncestorOf(maybeAncestor, maybeDescendant.parentNode)
    )
  )
}

// Note: we map `event.keyCode` to names instead of using `event.key` because
// the latter is not consistently supported across engines, particularly Webkit.
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key#Browser_compatibility
export enum KEY_NAMES_US {
  BACKSPACE  = 8,
  TAB        = 9,
  ENTER      = 13,
  ESCAPE     = 27,
  SPACE      = 32,
  ARROWLEFT  = 37,
  ARROWUP    = 38,
  ARROWRIGHT = 39,
  ARROWDOWN  = 40,
  J          = 74,
  K          = 75,
}

export function eventKeyCode({keyCode}: KeyboardEvent): number {
  return keyCode
}

export function addEvent(
  target: EventTarget,
  name: string,
  fun: EventListenerOrEventListenerObject,
  useCapture: boolean = false
): () => void {
  f.validate(fun, f.isFunction)
  f.validate(useCapture, f.isBoolean)

  target.addEventListener(name, fun, useCapture)

  return function removeEvent(): void {
    target.removeEventListener(name, fun, useCapture)
  }
}

export function preventDefault(event: Event): void {
  if (event && event.preventDefault) {
    event.preventDefault()
  }
}

export function stopPropagation(event: Event): void {
  if (event && event.stopPropagation) {
    event.stopPropagation()
  }
}



export function isMobile(context: t.AppContext): boolean {
  return context.isMobile
}

// Measures the CURRENT width of the body scrollbar. Returns ZERO if the body
// doesn't currently have a scrollbar. This relies on the fact that in our CSS,
// we always set `overflow-y: scroll` for the body, which allows to avoid layout
// shifting when navigating between pages that overflow and ones that don't.
export function getGlobalScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth
}



/**
 * Format
 */

export function toValidDate(value: any): void | Date {
  // Gotcha: `new Date(null)` ≡ `new Date(0)`
  if (value == null) return undefined
  const date = new Date(value)
  return f.isValidDate(date) ? date : undefined
}

export function dateIsoString(value: any): string {
  const date = toValidDate(value)
  return date ? date.toISOString() : ''
}

export function formatDate(value: any): string {
  const match = dateIsoString(value).match(/(\d\d\d\d-\d\d-\d\d)/)
  return match ? match[1] : ''
}

export function addBrowserOffset(value: any): void | Date {
  const date: void | Date = toValidDate(value)
  if (!date) return undefined
  date.setTime(date.getTime() - (date.getTimezoneOffset() * 60 * 1000))
  return date
}

export function daysInMonth(year: number, month: number): number {
  f.validate(year, f.isNatural)
  f.validate(month, isMonthNumber)
  return new Date(year, month + 1, 0).getDate()
}

function isMonthNumber(month: number): boolean {
  return f.isNatural(month) && month >= 0 && month <= 11
}

export function daysInMonthList(year: number, month: number): number[] {
  return year != null && month != null
    ? f.range(1, daysInMonth(year, month) + 1)
    : f.range(1, 32)
}

export function parseNum(value: any): void | number {
  if (f.isString(value)) value = parseFloat(value)
  if (f.isFinite(value)) return value
  return undefined
}

/**
 * Net
 */

export function jsonParams(params: void | t.JsonParams): t.XHttpParams {
  return emerge.merge(params, {headers: jsonHeaders})
}

const jsonHeaders = {
  accept: 'application/json',
  'content-type': 'application/json',
}

export function langHeaders(lang: t.LANG): {[key: string]: t.LANG} {
  return {[window.VARS.LANG_HEADER_NAME]: lang}
}



/**
 * Local storage
 *
 * Accessing localStorage may throw an error depending on browser / device /
 * browsing mode. For instance, writing to LS throws in Safari (iOS / OS X) in
 * private mode. We ignore all storage errors.
 */

// TODO Move to env.properties
const STORAGE_KEY: string = 'data'

export const storage: {[key: string]: any} | Storage = initStorage() || {}

function initStorage(): void | Storage {
  try {return localStorage}
  catch (err) {
    console.warn('Failed to initialise localStorage:', err)
    return undefined
  }
}

export function storageRead(path: t.Path): any {
  f.validate(path, isPath)
  try {
    if (!storage[STORAGE_KEY]) return undefined
    return emerge.getIn(JSON.parse(storage[STORAGE_KEY]), path)
  }
  catch (err) {
    console.warn('Failed to read from storage:', err)
    return undefined
  }
}

export function storageWrite(path: t.Path, value: any): void {
  f.validate(path, isPath)

  try {storage[STORAGE_KEY] = JSON.stringify(emerge.putIn(storageRead([]), path, value))}
  catch (err) {
    console.warn('Failed to save to storage:', err)
  }
}



/**
 * Location
 */

export function decodeQuery(searchString: string): t.DecodedQuery {
  return querystring.decode((searchString).replace(/^[?]/, ''))
}

export function encodeQuery(query: t.DecodedQueryInput): string {
  return prepend('?', querystring.encode(f.omitBy(
    query,
    (value: any): boolean => !value
  )))
}

export function prepend(char: string, value: void | string): string {
  f.validate(char, f.isString)
  if (value == null || value === '') return ''
  f.validate(value, f.isString)
  return value[0] === char ? value : char + value
}



/**
 * Misc
 */

// Note: if the URL contains spaces or other non-URL characters, it must be
// URL-encoded before calling this function. We can't encode them
// indiscriminately, because that would wreck some valid URLs.
export function bgUrl(url: string): void | t.BgUrl {
  if (url == null || url === '') return undefined
  f.validate(url, f.isString)
  return {backgroundImage: `url(${url})`}
}

function isPath (value: any): boolean {
  return f.isList(value) && f.every(value, f.isKey)
}

export function omitEmpty(value: void | t.Dict): t.Dict {
  return f.omitBy(value, (v: any) => {
    return f.isArray(v) || f.isDict(v)
      ? f.isEmpty(v)
      : f.isString(v)
      ? !v
      : f.isDate(v)
      ? !v
      : v == null
  })
}
