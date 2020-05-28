import * as t from '../types'

import React from 'react'

// @ts-ignore
import * as fpx from 'fpx'

import * as u from '../utils'
import * as g from '../geometry'
import * as i18n from '../i18n'

import * as m from './misc'

export class G7FormLine extends m.ViewComponent {
  render() {
    const {
      context,
      props: {children},
    } = this

    if (g.isMobile(context)) {
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


type FormLabelProps = {
  className?: string,
  htmlFor?: string,
}

export class FormLabel extends m.ViewComponent<FormLabelProps> {
  render() {
    const {
      context,
      props: {children, className: cls, htmlFor},
    } = this

    if (g.isMobile(context)) {
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


type FormTextElementProps = {
  label: string,
  name?: string,
  type?: string,
  step?: string | number,
  readOnly?: boolean,
  disabled?: boolean,
  value: undefined | number | string,
  onUpdate: (value: string) => void,
}

export class FormTextElement extends m.ViewComponent<FormTextElementProps> {
  onChange = (event: t.RChangeEvent): void => {
    const {target: {value}} = event
    const {onUpdate} = this.props
    onUpdate(value)
  }

  render() {
    const {
      props: {
        label,
        name,
        type,
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
          type={type || 'text'}
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


type FormDateElementProps = {
  name: string,
  label: string,
  readOnly?: boolean,
  disabled?: boolean,
  value: void | number | string | Date,
  onUpdate: (date: undefined | Date) => void,
}

type FormDateElementState = {
  year: void | number,
  month: void | number,
  day: void | number,
  days: void | number[],
  prevPropsValue: void | number | string | Date,
}

export class FormDateElement extends m.ViewComponent<FormDateElementProps, FormDateElementState> {
  years: number[] = fpx.reverse(fpx.range(1940, new Date().getFullYear() + 1))
  months: {value: number, key: string, translations: t.TranslationsByLang}[] = [
    {value: 0,  key: 'January',   translations: i18n.JANUARY},
    {value: 1,  key: 'February',  translations: i18n.FEBRUARY},
    {value: 2,  key: 'March',     translations: i18n.MARCH},
    {value: 3,  key: 'April',     translations: i18n.APRIL},
    {value: 4,  key: 'May',       translations: i18n.MAY},
    {value: 5,  key: 'June',      translations: i18n.JUNE},
    {value: 6,  key: 'July',      translations: i18n.JULY},
    {value: 7,  key: 'August',    translations: i18n.AUGUST},
    {value: 8,  key: 'September', translations: i18n.SEPTEMBER},
    {value: 9,  key: 'October',   translations: i18n.OCTOBER},
    {value: 10, key: 'November',  translations: i18n.NOVEMBER},
    {value: 11, key: 'December',  translations: i18n.DECEMBER},
  ]

  state: Readonly<FormDateElementState> = {
    year: undefined,
    month: undefined,
    day: undefined,
    days: undefined,
    prevPropsValue: undefined,
  }

  static getDerivedStateFromProps(
    props: FormDateElementProps,
    state: FormDateElementState
  ) {
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

  onYearInput = ({target: {value: year}}): void => {
    year = u.parseNum(year)
    const month = this.mayBeMonth(year, this.state.month)
    const days  = u.daysInMonthList(year, month)
    const day   = this.mayBeDay(days, this.state.day)
    this.setState({year, month, day, days})
    this.onDateInput(year, month, day)
  }

  onMonthInput = ({target: {value: month}}): void => {
    month = u.parseNum(month)
    const year = this.state.year
    const days = u.daysInMonthList(year, month)
    const day  = this.mayBeDay(days, this.state.day)
    this.setState({month, day, days})
    this.onDateInput(year, month, day)
  }

  onDayInput = ({target: {value: day}}): void => {
    day = u.parseNum(day)
    const {year, month} = this.state
    this.setState({day})
    this.onDateInput(year, month, day)
  }

  onDateInput = (
    year: void | number,
    month: void | number,
    day: void | number
  ): void => {
    const {props: {onUpdate}} = this

    if (typeof onUpdate !== 'function') {
      return
    }

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
    year: void | number,
    month: void | number
  ): void | number {
    return year == null ? undefined : month
  }

  mayBeDay(
    days: number[],
    day: void | number
  ): void | number {
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
            {months.map(({value, key, translations}) => (
              <option
                key={key}
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

type FormSelectElementProps = {
  label: string,
  name?: string,
  disabled?: boolean,
  value: undefined | number | string | string[],
  onUpdate: (value: void | number | string) => void
}

export class FormSelectElement extends m.ViewComponent<FormSelectElementProps> {
  onChange = ({target: {value}}): void => {
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


type FormErrorsProps = {
  errors: void | t.ValidationError[],
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


export type RadioValue = number | string

type RadioProps = {
  name           : string,
  value          : RadioValue,
  defaultChecked?: boolean,
  checked        : boolean,
  readOnly?      : boolean,
  disabled?      : boolean,
  onUpdate       : (value: RadioValue) => void,
}

export class Radio extends m.ViewComponent<RadioProps> {
  onChange = ({target: {value}}) => {
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
