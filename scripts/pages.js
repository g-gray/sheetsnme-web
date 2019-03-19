import React from 'react'
import {setMobileLayout} from './actions'

import * as f from 'fpx'
import * as u from './utils'

import {store} from './main'

class PageLayout extends u.ViewComponent {
  componentWillMount() {
    store.dispatch(setMobileLayout(false))
  }

  render({props: {className: cls, style, children}}) {
    return (
      <div className='relative col-start-stretch stretch-to-viewport-v bg-body'>
        {/*
        <Navbar {...props} />
        */}
        <div
          className={`flex-1 ${cls || ''}`}
          style={style}
          children={children} />
      </div>
    )
  }
}

class MobilePageLayout extends u.ViewComponent {
  componentWillMount() {
    store.dispatch(setMobileLayout(true))
  }

  render({props: {className: cls, style, children}}) {
    return (
      <div className='relative col-start-stretch stretch-to-viewport-v bg-body'>
        {/*
        <Navbar {...props} />
        */}
        <div
          className={`flex-1 ${cls || ''}`}
          style={style}
          children={children} />
      </div>
    )
  }
}

export class HomePage extends u.ViewComponent {
  render({
    props,
    context,
  }) {
    if (u.isMobileGeometry(context)) {
      return (
        <MobilePageLayout title='Add transaction' {...props}>
          <div className='col-start-stretch bg-white'>
            <TransactionForm />
          </div>
        </MobilePageLayout>
      )
    }

    return (
      <PageLayout {...props}>
        <div className='fixed-limit-width row-start-stretch grid12 padding-v-1'>
          <div className='grid12-2 col-start-stretch gaps-v-1x25'>
            {/*
            <Sidenav {...props} />
            */}
          </div>
          <div className='grid12-7 col-start-stretch gaps-v-1x25'>
            <div className='widget col-start-stretch'>
              <div className='rounded-t row-start-center padding-h-1x25 padding-v-0x75 bg-black-97'>
                <h1 className='font-large'>
                  Add transaction
                </h1>
              </div>
              <hr className='hr' />
              <TransactionForm />
            </div>
          </div>
          <div className='grid12-3 col-start-stretch gaps-v-1x25' />
        </div>
      </PageLayout>
    )
  }
}

class TransactionForm extends u.ViewComponent {
  render({context}) {
    if (u.isMobileLayout(context)) {
      return (
        <form className='col-start-stretch'>
          <div className='col-start-stretch padding-v-1 padding-h-1x25'>
            <FormDateElement label='Date' defaultValue={new Date()} />
            <div className='col-start-stretch gaps-v-0x5 mobile-form-element-spacing'>
              <label className='row-start-center fg-black-50'>
                Type:
              </label>
              <div className='col-start-stretch gaps-v-0x5'>
                <label className='row-start-center gaps-h-0x5'>
                  <Radio
                    name='transaction-type'
                    value='outcome'
                    defaultChecked />
                  <span>Outcome</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <Radio
                    name='transaction-type'
                    value='income' />
                  <span>Income</span>
                </label>
              </div>
            </div>
            <FormTextElement label='Amount' />
            <FormSelectElement label='Category'>
              <option value='' />
              <option value='education'>Education</option>
              <option value='health'>Health</option>
              <option value='food'>Food</option>
              <option value='fastfood'>Fastfood</option>
              <option value='fuel'>Fuel</option>
            </FormSelectElement>
            <FormTextElement label='Recipient' />
          </div>
          <hr className='hr margin-h-1x25' />
          <div className='row-center-center padding-v-1 padding-h-1x25'>
            <button
              type='submit'
              className='btn-primary btn-wide'>
              Submit
            </button>
          </div>
        </form>
      )
    }

    return (
      <form className='col-start-stretch'>
        <div className='col-start-stretch padding-v-1x25'>
          <FormDateElement label='Date' defaultValue={new Date()} />
          <G7FormLine className='form-element-spacing'>
            <label className='row-end-center fg-black-50'>
              Type:
            </label>
            <div className='row-start-center gaps-h-1'>
              <label className='row-start-center gaps-h-0x5'>
                <Radio
                  name='transaction-type'
                  value='outcome'
                  defaultChecked />
                <span>Outcome</span>
              </label>
              <label className='row-start-center gaps-h-0x5'>
                <Radio
                  name='transaction-type'
                  value='income' />
                <span>Income</span>
              </label>
            </div>
          </G7FormLine>
          <FormTextElement label='Amount' />
          <FormSelectElement label='Category'>
            <option value='' />
            <option value='education'>Education</option>
            <option value='health'>Health</option>
            <option value='food'>Food</option>
            <option value='fastfood'>Fastfood</option>
            <option value='fuel'>Fuel</option>
          </FormSelectElement>
          <FormTextElement label='Recipient' />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-center-center padding-v-1 padding-h-1x25'>
          <button
            type='submit'
            className='btn-primary btn-wide'>
            Submit
          </button>
        </div>
      </form>
    )
  }
}

class G7FormLine extends u.ViewComponent {
  render({props: {children, className: cls}}) {
    return (
      <div className={`grid7 row-start-start ${cls || ''}`}>
        <div className='grid7-2 col-start-stretch padding-l-1x25 text-right'>
          {f.get(children, 0)}
        </div>
        <div className='grid7-4 col-start-stretch'>
          {f.get(children, 1)}
        </div>
        <div className='flex-1 col-start-start padding-r-1x25'>
          {f.get(children, 2)}
        </div>
      </div>
    )
  }
}

class FormTextElement extends u.ViewComponent {
  constructor({ident, onUpdate}) {
    super(...arguments)
    this.onChange = ({target: {value}}) => {
      if (onUpdate) onUpdate(ident, value)
    }
  }

  render({
    onChange,
    context,
    props: {label, input_type, ident, value, readOnly, disabled},
  }) {
    if (u.isMobileLayout(context)) {
      return (
        <div className='col-start-stretch gaps-v-0x5 mobile-form-element-spacing'>
          <label
            className='row-start-center fg-black-50'
            htmlFor={ident}>
            {label}:
          </label>
          <input
            id={ident}
            name={ident}
            type={input_type || 'text'}
            className='input'
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            disabled={disabled} />
        </div>
      )
    }

    return (
      <G7FormLine className='form-element-spacing'>
        <label
          className='row-end-center input-height fg-black-50'
          htmlFor={ident}>
          {label}:
        </label>
        <input
          id={ident}
          name={ident}
          type={input_type || 'text'}
          className='input'
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled} />
      </G7FormLine>
    )
  }
}

class FormDateElement extends u.ViewComponent {
  render({
    context,
    props: {label},
  }) {
    if (u.isMobileLayout(context)) {
      return (
        <div className='col-start-stretch gaps-v-0x5 mobile-form-element-spacing'>
          <label className='row-start-center fg-black-50'>
            {label}:
          </label>
          <FormDateInputs />
        </div>
      )
    }

    return (
      <G7FormLine className='form-element-spacing'>
        <label className='row-end-center input-height fg-black-50'>
          {label}:
        </label>
        <FormDateInputs />
      </G7FormLine>
    )
  }
}

class FormDateInputs extends u.ViewComponent {
  constructor() {
    super(...arguments)
    const {props: {ident, value, defaultValue, onUpdate}} = this

    this.onYearInput = ({target: {value: year}}) => {
      year = u.parseNum(year)
      const month = this.mayBeMonth(year, this.state.month)
      const days = u.daysInMonthList(year, month)
      const day = this.mayBeDay(days, this.state.day)
      this.setState({year, month, day, days})
      this.onDateInput(year, month, day)
    }

    this.onMonthInput = ({target: {value: month}}) => {
      month = u.parseNum(month)
      const year = this.state.year
      const days = u.daysInMonthList(year, month)
      const day = this.mayBeDay(days, this.state.day)
      this.setState({month, day, days})
      this.onDateInput(year, month, day)
    }

    this.onDayInput = ({target: {value: day}}) => {
      day = u.parseNum(day)
      const {year, month} = this.state
      this.setState({day})
      this.onDateInput(year, month, day)
    }

    this.onDateInput = (year, month, day) => {
      if (month != null && month != null && day != null) {
        const date = u.addBrowserOffset(new Date(year, month, day))
        if (onUpdate) onUpdate(ident, date)
      }
      else {
        // Handle error
        if (onUpdate) onUpdate(ident, undefined)
        console.warn('Entered date is invalid')
      }
    }

    this.mayBeMonth = (year, month) => {
      return year == null ? undefined : month
    }

    this.mayBeDay = (days, day) => {
      return f.includes(days, day) ? day : undefined
    }

    const date = u.toValidDate(value || defaultValue)
    const {year, month, day} = date
      ? {year: date.getFullYear(), month: date.getMonth(), day: date.getDate()}
      : {year: undefined, month: undefined, day: undefined}

    const years  = f.reverse(f.range(1940, new Date().getFullYear() + 1))
    const months = [
      {value: 0,  text: 'January'},
      {value: 1,  text: 'February'},
      {value: 2,  text: 'March'},
      {value: 3,  text: 'April'},
      {value: 4,  text: 'May'},
      {value: 5,  text: 'June'},
      {value: 6,  text: 'July'},
      {value: 7,  text: 'August'},
      {value: 8,  text: 'September'},
      {value: 9,  text: 'October'},
      {value: 10, text: 'November'},
      {value: 11, text: 'December'},
    ]
    const days = u.daysInMonthList(year, month)

    this.state = {years, months, days, day, month, year}
  }

  render({
    props,
    state,
    onYearInput,
    onMonthInput,
    onDayInput,
  }) {
    const {readOnly, disabled} = props
    const {years, months, days, year, month, day} = state

    return (
      <div className='row-start-stretch gaps-h-0x5'>
        <select
          className='flex-3 select-native'
          onChange={onYearInput}
          value={year}
          disabled={readOnly || disabled}>
          <option value=''>
            Year:
          </option>
          {f.map(years, year => (
            <option
              key={year}
              value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          className='flex-5 select-native'
          value={month}
          onChange={onMonthInput}
          disabled={readOnly || disabled}>
          <option value=''>
            Month:
          </option>
          {f.map(months, ({value, text}) => (
            <option
              key={value}
              value={value}>
              {text}
            </option>
          ))}
        </select>
        <select
          className='flex-3 select-native'
          value={day}
          onChange={onDayInput}
          disabled={readOnly || disabled}>
          <option value=''>
            Day:
          </option>
          {f.map(days, day => (
            <option
              key={day}
              value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
    )
  }
}

class FormSelectElement extends u.ViewComponent {
  constructor({ident, onUpdate}) {
    super(...arguments)
    this.onChange = ({target: {value}}) => {
      if (onUpdate) onUpdate(ident, value)
    }
  }

  render({
    onChange,
    context,
    props: {label, ident, value, readOnly, disabled, children},
  }) {
    if (u.isMobileLayout(context)) {
      return (
        <div className='col-start-stretch gaps-v-0x5 mobile-form-element-spacing'>
          <label
            className='row-start-center fg-black-50'
            htmlFor={ident}>
            {label}:
          </label>
          <select
            id={ident}
            name={ident}
            className='select-native'
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            disabled={disabled}>
            {children}
          </select>
        </div>
      )
    }

    return (
      <G7FormLine className='form-element-spacing'>
        <label className='row-end-center input-height fg-black-50'>
          {label}:
        </label>
        <select
          id={ident}
          name={ident}
          className='select-native'
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled}>
          {children}
        </select>
      </G7FormLine>
    )
  }
}

class Radio extends u.ViewComponent {
  render({props}) {
    return (
      <label className='radio'>
        <input type='radio' className='radio-input' {...props} />
        <span className='radio-decorator' />
      </label>
    )
  }
}
