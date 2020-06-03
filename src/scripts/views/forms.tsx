import * as t from '../types'

import React from 'react'

// @ts-ignore
import * as fpx from 'fpx'

import * as u from '../utils'
import * as i18n from '../i18n'

import * as m from './misc'

export class G7FormLine extends m.ViewComponent {
  render() {
    const {
      context: {isMobile},
      props: {children},
    } = this

    if (isMobile) {
      return (
        <div className='col-start-stretch gaps-v-0x5 mobile-form-element-spacing'>
          {children}
        </div>
      )
    }

    return (
      <div className='grid7 row-start-start form-element-spacing'>
        <div className='grid7-2 col-start-stretch padding-l-1x25 text-right'>
          {fpx.get(children, 0)}
        </div>
        <div className='grid7-4 col-start-stretch'>
          {fpx.get(children, 1)}
        </div>
        <div className='flex-1 col-start-start padding-r-1x25'>
          {fpx.get(children, 2)}
        </div>
      </div>
    )
  }
}



/**
 * FormLabel
 */

type FormLabelProps = {
  className?: string,
  htmlFor?  : string,
}


export class FormLabel extends m.ViewComponent<FormLabelProps> {
  render() {
    const {
      context: {isMobile},
      props: {children, className: cls, htmlFor},
    } = this

    if (isMobile) {
      return (
        <label
          className={`row-start-center fg-on-surface-pale ${cls || ''}`}
          htmlFor={htmlFor}
        >
          {children}:
        </label>
      )
    }

    return (
      <label
        className={`row-end-center fg-on-surface-pale ${cls || ''}`}
        htmlFor={htmlFor}
      >
        {children}:
      </label>
    )
  }
}



/**
 * FormTextElement
 */

type FormTextElementProps = {
  label    : string,
  name?    : string,
  readOnly?: boolean,
  disabled?: boolean,
  value    : undefined | string,
  onUpdate : (value: string) => void,
}


export class FormTextElement extends m.ViewComponent<FormTextElementProps> {
  onChange = (event: t.RChangeEvent<HTMLInputElement>): void => {
    const {target: {value}} = event
    const {onUpdate} = this.props
    onUpdate(value)
  }

  render() {
    const {
      props: {
        label,
        name,
        value,
        readOnly,
        disabled
      },
      onChange,
    } = this

    return (
      <G7FormLine>
        <FormLabel
          className='input-height'
          htmlFor={name}
        >
          {label}
        </FormLabel>
        <input
          className='input'
          id={name}
          name={name}
          type='text'
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          onChange={onChange}
        />
      </G7FormLine>
    )
  }
}



/**
 * FormNumberElement
 */

type FormNumberElementProps = {
  label    : string,
  name?    : string,
  step?    : number | string,
  readOnly?: boolean,
  disabled?: boolean,
  value    : undefined | number,
  onUpdate : (value: undefined | number) => void,
}

export class FormNumberElement extends m.ViewComponent<FormNumberElementProps> {
  onChange = (event: t.RChangeEvent<HTMLInputElement>): void => {
    const {target: {value}} = event
    const {onUpdate} = this.props
    onUpdate(u.parseNum(value))
  }

  render() {
    const {
      props: {
        label,
        name,
        step,
        value,
        readOnly,
        disabled
      },
      onChange,
    } = this

    return (
      <G7FormLine>
        <FormLabel
          className='input-height'
          htmlFor={name}
        >
          {label}
        </FormLabel>
        <input
          className='input'
          id={name}
          name={name}
          type='number'
          step={step}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          onChange={onChange}
        />
      </G7FormLine>
    )
  }
}



/**
 * FormDateElement
 */

type FormDateElementProps = {
  name     : string,
  label    : string,
  readOnly?: boolean,
  disabled?: boolean,
  value    : undefined | string,
  onUpdate : (date: undefined | Date) => void,
}

type FormDateElementState = {
  year          : undefined | number,
  month         : undefined | number,
  day           : undefined | number,
  days          : undefined | number[],
  prevPropsValue: undefined | string,
}


export class FormDateElement extends m.ViewComponent<FormDateElementProps, FormDateElementState> {
  years: number[] = fpx.reverse(fpx.range(1940, new Date().getFullYear() + 1))
  months: {value: number, translations: t.TranslationsByLang}[] = [
    {value: 1,  translations: i18n.FEBRUARY},
    {value: 2,  translations: i18n.MARCH},
    {value: 3,  translations: i18n.APRIL},
    {value: 4,  translations: i18n.MAY},
    {value: 5,  translations: i18n.JUNE},
    {value: 6,  translations: i18n.JULY},
    {value: 7,  translations: i18n.AUGUST},
    {value: 8,  translations: i18n.SEPTEMBER},
    {value: 0,  translations: i18n.JANUARY},
    {value: 9,  translations: i18n.OCTOBER},
    {value: 10, translations: i18n.NOVEMBER},
    {value: 11, translations: i18n.DECEMBER},
  ]

  readonly state = {
    year: undefined,
    month: undefined,
    day: undefined,
    days: undefined,
    prevPropsValue: undefined,
  }

  static getDerivedStateFromProps(
    props: FormDateElementProps,
    state: FormDateElementState
  ): FormDateElementState {
    const {value} = props

    if (value !== state.prevPropsValue) {
      const date = u.toValidDate(value)
      const {year, month, day} = date
        ? {year: date.getFullYear(), month: date.getMonth(), day: date.getDate()}
        : {year: undefined, month: undefined, day: undefined}
      const days = u.daysInMonthList(year, month)

      return {
        year,
        month,
        day,
        days,
        prevPropsValue: value,
      }
    }

    return state
  }

  onYearInput = (event: t.RChangeEvent<HTMLSelectElement>): void => {
    const {target: {value}} = event
    const year = u.parseNum(value)
    const month = this.mayBeMonth(year, this.state.month)
    const days = u.daysInMonthList(year, month)
    const day = this.mayBeDay(days, this.state.day)
    this.setState({year, month, day, days})
    this.onDateInput(year, month, day)
  }

  onMonthInput = (event: t.RChangeEvent<HTMLSelectElement>): void => {
    const {target: {value}} = event
    const month = u.parseNum(value)
    const year = this.state.year
    const days = u.daysInMonthList(year, month)
    const day = this.mayBeDay(days, this.state.day)
    this.setState({month, day, days})
    this.onDateInput(year, month, day)
  }

  onDayInput = (event: t.RChangeEvent<HTMLSelectElement>): void => {
    const {target: {value}} = event
    const day = u.parseNum(value)
    const {year, month} = this.state
    this.setState({day})
    this.onDateInput(year, month, day)
  }

  onDateInput = (
    year : undefined | number,
    month: undefined | number,
    day  : undefined | number
  ): void => {
    const {props: {onUpdate}} = this

    if (year != null && month != null && day != null) {
      const date = u.addBrowserOffset(new Date(year, month, day))
      if (date != null) {
        onUpdate(date)
      }
    }
    else {
      onUpdate(undefined)
      console.warn('Entered date is invalid')
    }
  }

  mayBeMonth(
    year : undefined | number,
    month: undefined | number
  ): undefined | number {
    return year == null ? undefined : month
  }

  mayBeDay(
    days: number[],
    day : undefined | number
  ): undefined | number {
    return fpx.includes(days, day) ? day : undefined
  }

  render() {
    const {
      context,
      props: {label, name, readOnly, disabled},
      state: {days, year, month, day},
      years, months, onYearInput, onMonthInput, onDayInput,
    } = this

    return (
      <G7FormLine>
        <FormLabel className='input-height'>
          {label}
        </FormLabel>
        <div className='row-start-stretch gaps-h-0x5'>
          <select
            className='flex-3 select-native'
            name={`${name}-year`}
            value={year == null ? '' : year}
            onChange={onYearInput}
            disabled={readOnly || disabled}
          >
            <option value=''>
              {i18n.xln(context, i18n.YEAR)}:
            </option>
            {years.map(year => (
              <option
                key={year}
                value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            className='flex-5 select-native'
            name={`${name}-month`}
            value={month == null ? '' : month}
            disabled={readOnly || disabled}
            onChange={onMonthInput}
          >
            <option value=''>
              {i18n.xln(context, i18n.MONTH)}:
            </option>
            {months.map(({value, translations}) => (
              <option
                key={value}
                value={value}>
                {i18n.xln(context, translations)}
              </option>
            ))}
          </select>
          <select
            className='flex-3 select-native'
            name={`${name}-day`}
            value={day == null ? '' : day}
            disabled={readOnly || disabled}
            onChange={onDayInput}
          >
            <option value=''>
              {i18n.xln(context, i18n.DAY)}:
            </option>
            {(days || []).map(day => (
              <option
                key={day}
                value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </G7FormLine>
    )
  }
}



/**
 * FormSelectElement
 */

type FormSelectElementProps = {
  label    : string,
  name?    : string,
  disabled?: boolean,
  value    : undefined | string,
  onUpdate : (value: void | string) => void
}


export class FormSelectElement extends m.ViewComponent<FormSelectElementProps> {
  onChange = (event: t.RChangeEvent<HTMLSelectElement>): void => {
    const {target: {value}} = event
    const {onUpdate} = this.props
    onUpdate(value)
  }

  render() {
    const {
      props: {
        label,
        name,
        disabled,
        value,
        children,
      },
      onChange,
    }= this

    return (
      <G7FormLine>
        <FormLabel className='input-height' htmlFor={name}>
          {label}
        </FormLabel>
        <select
          className='select-native'
          id={name}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
        >
          {children}
        </select>
      </G7FormLine>
    )
  }
}



/**
 * FormErrors
 */

type FormErrorsProps = {
  errors: undefined | t.ValidationError[],
}


export class FormErrors extends m.ViewComponent<FormErrorsProps> {
  render() {
    const {props: {errors}} = this

    return !errors ? null : (
      <div className='col-start-center padding-v-1 fg-accent font-midsmall'>
        {errors.map(({text}, index) => (
          <p key={`error-${index}`}>{text}</p>
        ))}
      </div>
    )
  }
}



/**
 * Radio
 */


type RadioProps = {
  name           : string,
  value          : undefined | string,
  defaultChecked?: boolean,
  checked        : boolean,
  readOnly?      : boolean,
  disabled?      : boolean,
  onUpdate       : (value: string) => void,
}

export class Radio extends m.ViewComponent<RadioProps> {
  onChange = (event: t.RChangeEvent<HTMLInputElement>) => {
    const {target: {value}} = event
    const {onUpdate} = this.props
    onUpdate(value)
  }

  render() {
    const {
      onChange,
      props: {
        name,
        value,
        defaultChecked,
        checked,
        readOnly,
        disabled,
      },
    } = this

    return (
      <label className='radio'>
        <input
          className='radio-input'
          type='radio'
          id={`${name}_${value}`}
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          checked={checked}
          readOnly={readOnly}
          disabled={disabled}
          onChange={onChange}
        />
        <span className='radio-decorator' />
      </label>
    )
  }
}
