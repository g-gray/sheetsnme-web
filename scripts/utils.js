import React from 'react'
import ReactDom from 'react-dom'

import * as f from 'fpx'
import * as e from 'emerge'

export const MOBILE_WIDTH_MAX = 980

/**
 * View
 */

export const Context = React.createContext({})

export class ViewComponent extends React.Component {
  static contextType = Context

  constructor(a, b, c) {
    super(a, b, c)
    this.render = renderWithArg
  }
}

/* eslint-disable no-invalid-this */

function renderWithArg() {
  // Minor convenience: pass self as argument.
  return this.constructor.prototype.render.call(this, this)
}

export function isViewInstance(value) {
  return f.isObject(value) &&
    f.isFunction(value.setState) &&
    f.isFunction(value.forceUpdate)
}

// React-specific
export function findDomNode(element) {
  element = ReactDom.findDOMNode(element)
  if (element != null) f.validate(element, isElement)
  return element
}

/**
 * Dom
 */

export function isNode(value) {
  return f.isInstance(value, Node)
}

export function isElement(value) {
  return f.isInstance(value, Element)
}

export function isAncestorOf(maybeAncestor, maybeDescendant) {
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
const KEY_NAMES_US = {
  8:  'Backspace',
  9:  'Tab',
  13: 'Enter',
  27: 'Escape',
  32: 'Space',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  74: 'j',
  75: 'k',
}

export function eventKeyName({keyCode}) {
  return KEY_NAMES_US[keyCode]
}

export function addEvent(target, name, fun, useCapture = false) {
  f.validate(fun, f.isFunction)
  f.validate(useCapture, f.isBoolean)

  target.addEventListener(name, fun, useCapture)

  return function removeEvent() {
    target.removeEventListener(name, fun, useCapture)
  }
}

export function preventDefault(event) {
  if (event && event.preventDefault) event.preventDefault()
}

export function stopPropagation(event) {
  if (event && event.stopPropagation) event.stopPropagation()
}

export function geometry (width) {
  return {width, isMobile: width <= MOBILE_WIDTH_MAX}
}

export function isMobile(context) {
  return f.scan(context, 'isMobile')
}

// Measures the CURRENT width of the body scrollbar. Returns ZERO if the body
// doesn't currently have a scrollbar. This relies on the fact that in our CSS,
// we always set `overflow-y: scroll` for the body, which allows to avoid layout
// shifting when navigating between pages that overflow and ones that don't.
export function getGlobalScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth
}

/**
 * Format
 */

export function toValidDate(value) {
  // Gotcha: `new Date(null)` ≡ `new Date(0)`
  if (value == null) return undefined
  const date = new Date(value)
  return f.isValidDate(date) ? date : undefined
}

export function dateIsoString(value) {
  const date = toValidDate(value)
  return date ? date.toISOString() : ''
}

export function formatDate(value) {
  const match = dateIsoString(value).match(/(\d\d\d\d-\d\d-\d\d)/)
  return match ? match[1] : ''
}

export function addBrowserOffset(date) {
  if (!f.isValidDate(date)) return undefined
  date.setTime(date.getTime() - (date.getTimezoneOffset() * 60 * 1000))
  return date
}

export function daysInMonth(year, month) {
  f.validate(year, f.isNatural)
  f.validate(month, isMonthNumber)
  return new Date(year, month + 1, 0).getDate()
}

function isMonthNumber(month) {
  return f.isNatural(month) && month >= 0 && month <= 11
}

export function daysInMonthList(year, month) {
  return year != null && month != null
    ? f.range(1, daysInMonth(year, month) + 1)
    : f.range(1, 32)
}

export function parseNum(value) {
  if (f.isString(value)) value = parseFloat(value, 10)
  if (f.isFinite(value)) return value
  return undefined
}

/**
 * Net
 */

export function jsonParams(params) {
  return e.merge(params, {headers: jsonHeaders})
}

const jsonHeaders = {
  accept: 'application/json',
  'content-type': 'application/json',
}

/**
 * Misc
 */

// Note: if the URL contains spaces or other non-URL characters, it must be
// URL-encoded before calling this function. We can't encode them
// indiscriminately, because that would wreck some valid URLs.
export function bgUrl(url) {
  if (url == null || url === '') return undefined
  f.validate(url, f.isString)
  return {backgroundImage: `url(${url})`}
}

export function bindValue(component, path, fun) {
  f.validate(component, isComponent)
  f.validate(path, isPath)

  return {
    onUpdate: value => {
      component.setState(e.putIn(component.state, path, f.isFunction(fun) ? fun(value) : value))
    },
    defaultValue: f.getIn(component.state, path),
  }
}

export function bindChecked(component, path, componentValue) {
  f.validate(component, isComponent)
  f.validate(path, isPath)

  return {
    onUpdate: value => {
      component.setState(e.patchIn(component.state, path, value))
    },
    value: componentValue,
    defaultChecked: f.getIn(component.state, path) === componentValue,
  }
}

function isComponent(value) {
  return f.isInstance(value, React.Component)
}

function isPath (value) {
  return f.isList(value) && f.every(value, f.isKey)
}
