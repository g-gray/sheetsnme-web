import React from 'react'
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

/**
 * Dom
 */

export function geometry (width) {
  return {width, isMobile: width <= MOBILE_WIDTH_MAX}
}

export function isMobile(context) {
  return f.scan(context, 'isMobile')
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

// TODO: validate transaction
export function formatTransaction({date, category, payee, comment, account, amount, type}) {
  return {
    category,
    payee,
    comment,
    date: formatDate(date),
    accountOutcome: type === 'outcome' ? account : '',
    accountIncome: type === 'income' ? account : '',
    amountOutcome: type === 'outcome' ? amount : '',
    amountIncome: type === 'income' ? amount : '',
  }
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
