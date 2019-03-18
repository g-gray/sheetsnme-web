import React from 'react'
import * as f from 'fpx'

export const MOBILE_WIDTH_MAX = 980

/**
 * View
 */

export class ViewComponent extends React.Component {
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
  return {width, ...{isMobile: false}}
}

export function isMobile(props) {
  return f.scan(props, 'dom', 'geometry', 'width') <= MOBILE_WIDTH_MAX &&
         f.scan(props, 'hasMobileLayout')
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
