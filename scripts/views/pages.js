import React from 'react'
import {connect} from 'react-redux'

import * as f from 'fpx'
import * as e from 'emerge'

import * as a from '../actions'
import * as u from '../utils'

import * as m from './misc'
import * as s from './svg'

class PageLayout extends u.ViewComponent {
  render({props: {className: cls, style, children}}) {
    return (
      <div className='relative col-start-stretch stretch-to-viewport-v bg-body'>
        <Navbar />
        <div
          className={`flex-1 ${cls || ''}`}
          style={style}
          children={children} />
        <m.GlobalDialog />
      </div>
    )
  }
}

class MobilePageLayout extends u.ViewComponent {
  render({props: {className: cls, style, children}}) {
    return (
      <div className='relative col-start-stretch stretch-to-viewport-v bg-body'>
        <Navbar />
        <div
          className={`flex-1 ${cls || ''}`}
          style={style}
          children={children} />
        <m.GlobalDialog />
      </div>
    )
  }
}

class _Navbar extends u.ViewComponent {
  constructor(props) {
    super(props)

    this.state = {menuOpened: false}

    this.openMenu = () => {
      this.setState({menuOpened: true})
    }

    this.closeMenu = () => {
      this.setState({menuOpened: false})
    }
  }

  render({
    context,
    props: {setDialog},
  }) {
    if (u.isMobile(context)) {
      return (
        <header
          className='row-between-stretch bg-primary-100'
          style={{height: '3.25rem', borderBottom: '1px solid #4872a1'}}>
          <a href='/' className='row-center-center padding-0x75 decorate-dark-menu-item'>
            <s.PieChart style={{fontSize: '1.25rem'}} />
          </a>
          <m.FakeButton className='row-center-center padding-0x75 decorate-dark-menu-item'>
            <s.Menu
              style={{fontSize: '1.5rem'}}
              onClick={() => {setDialog(MobileMenu)}} />
          </m.FakeButton>
        </header>
      )
    }

    return (
      <header
        className='row-start-stretch bg-primary-100 min-width-page-max'
        style={{borderBottom: '1px solid #4872a1'}}>
        <div className='fixed-limit-width grid12 row-start-stretch'>
          <div className='grid12-2 row-start-stretch'>
            <a href='/' className='row-center-center padding-0x5 decorate-dark-menu-item'>
              <s.PieChart style={{fontSize: '1.5rem'}} />
            </a>
          </div>
          <div className='grid12-5 row-start-center gaps-h-0x75' />
          <div className='flex-1 row-end-stretch'>
            <UserMenu />
          </div>
        </div>
      </header>
    )
  }
}

const Navbar = connect(null, dispatch => ({
  setDialog: dialog => dispatch(a.setDialog(dialog)),
}))(_Navbar)

class _UserMenu extends u.ViewComponent {
  constructor(props) {
    super(props)

    this.state = {expanded: false}

    this.close = () => {
      this.setState({expanded: false})
    }

    this.toggle = () => {
      this.setState({expanded: !this.state.expanded})
    }
  }

  render({
    props: {user},
    state: {expanded},
  }) {
    const {firstName, lastName, pictureUrl} = user

    return f.isEmpty(user) ? null : (
      <div className='relative row-start-stretch'>
        <m.FakeButton
          onClick={this.toggle}
          className='relative row-start-stretch decorate-dark-menu-item z-index-2'
          aria-expanded={expanded}>
          <div className='relative row-center-center padding-h-0x5'>
            <m.CircleUserPic
              url={pictureUrl}
              size='1.75' />
            {!expanded ? null :
            <div className='dropdown-chevron dropdown-chevron-position' />}
          </div>
          <div className='row-start-center fg-white'>
            <span>{`${firstName || ''} ${lastName || ''}`}</span>
            <span className='row-center-center padding-h-0x25'>
              <s.ChevronDown />
            </span>
          </div>
        </m.FakeButton>
        {!expanded ? null :
        <m.Closer root={this} close={this.close}>
          <div
            className='dropdown-position-right-shifted z-index-1'
            onClick={this.close}>
            <div className='dropdown dropdown-padding col-start-stretch' style={{minWidth: '11rem'}}>
              <a href='/auth/logout' className='decorate-light-menu-item dropdown-item-padding'>
                Logout
              </a>
            </div>
          </div>
        </m.Closer>}
      </div>
    )
  }
}

const UserMenu = connect(state => ({
  user: state.net.user,
}))(_UserMenu)

class _MobileMenu extends u.ViewComponent {
  constructor(props) {
    super(props)

    this.close = this.props.setDialog.bind(null, null)
  }

  render({
    close,
    props: {user},
  }) {
    const {firstName, lastName, pictureUrl} = user

    return (
      <m.Dialog onEscape={close}>
        <m.DialogScrollable className='row-start-stretch bg-overlay-dark fade-in-fast' onClick={close}>
          <div className='relative bg-body slide-in-left-fast' style={{minWidth: '18rem'}} onClick={close}>
            <div className='row-start-center gaps-h-0x75 padding-0x75'>
              <m.CircleUserPic
                url={pictureUrl}
                size='3' />
              <span className='font-midlarge weight-medium'>
                {`${firstName || ''} ${lastName || ''}`}
              </span>
            </div>
            <div className='col-start-stretch gaps-v-0x5'>
              <div className='col-start-stretch'>
                <a
                  href='/auth/logout'
                  className='row-start-center gaps-h-1 padding-h-1 padding-v-0x5 theme-light-menu-busy'>
                  <span className='relative bg-circle-2x5 bg-primary-125'>
                    <s.LogOut className='abs-center font-large fg-white' />
                  </span>
                  <span className='col-start-stretch text-left decorate-link weight-medium'>
                    Logout
                  </span>
                </a>
              </div>
            </div>
          </div>
        </m.DialogScrollable>
      </m.Dialog>
    )
  }
}

const MobileMenu = connect(state => ({
  user: state.net.user,
}), dispatch => ({
  setDialog: dialog => dispatch(a.setDialog(dialog)),
}))(_MobileMenu)

export class HomePage extends u.ViewComponent {
  render({
    props,
    context,
  }) {
    if (u.isMobile(context)) {
      return (
        <MobilePageLayout title='Add transaction' {...props}>
          <div className='col-start-stretch gaps-v-0x75 padding-v-0x75'>
            <div className='mobile-widget col-start-stretch'>
              <TransactionForm />
            </div>
            <div className='mobile-widget col-start-stretch'>
              <TransactionsTable />
            </div>
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
            <div className='widget col-start-stretch'>
              <div className='rounded-t row-start-center padding-h-1x25 padding-v-0x75 bg-black-97'>
                <h1 className='font-large'>
                  Transactions
                </h1>
              </div>
              <hr className='hr' />
              <TransactionsTable />
            </div>
          </div>
          <div className='grid12-3 col-start-stretch gaps-v-1x25' />
        </div>
      </PageLayout>
    )
  }
}

class _TransactionForm extends u.ViewComponent {
  constructor(props) {
    super(props)

    this.state = {formValues: this.props.transaction || {}}

    this.onSubmit = event => {
      u.preventDefault(event)
      this.props.dispatch(a.createTransaction(this.state.formValues))
    }

    this.onUpdate = (key, value) => {
      this.setState({formValues: e.put(this.state.formValues, key, value)})
    }

    this.bindValue = key => ({
      ident: key,
      onUpdate: this.onUpdate,
      defaultValue: this.state.formValues[key],
    })
  }

  render({
    onSubmit,
    bindValue,
    onUpdate,
    context,
    state: {formValues},
    props: {categories, accounts, payees},
  }) {
    const isMobile = u.isMobile(context)

    return (
      <form className='col-start-stretch' onSubmit={onSubmit}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <FormDateElement
            label='Date'
            {...bindValue('date')} />
          <G7FormLine>
            <FormLabel>
              Type
            </FormLabel>
            <div className={isMobile ? 'col-start-stretch gaps-v-0x5' : 'row-start-center gaps-h-1'}>
              <label className='row-start-center gaps-h-0x5'>
                <Radio
                  ident='type'
                  value='outcome'
                  onUpdate={onUpdate}
                  defaultChecked={formValues.type === 'outcome'} />
                <span>Outcome</span>
              </label>
              <label className='row-start-center gaps-h-0x5'>
                <Radio
                  ident='type'
                  value='income'
                  onUpdate={onUpdate}
                  defaultChecked={formValues.type === 'income'} />
                <span>Income</span>
              </label>
            </div>
          </G7FormLine>
          <FormTextElement
            label='Amount'
            {...bindValue('amount')} />
          <FormSelectElement
            label='Account'
            {...bindValue('account')}>
            <option value='' />
            {f.map(accounts, ({id, title}) => !id || !title ? null : (
              <option value={id} key={`account-${id}`}>
                {title}
              </option>
            ))}
          </FormSelectElement>
          <FormSelectElement
            label='Category'
            {...bindValue('category')}>
            <option value='' />
            {f.map(categories, ({id, title}) => !id || !title ? null : (
              <option value={id} key={`category-${id}`}>
                {title}
              </option>
            ))}
          </FormSelectElement>
          <FormSelectElement
            label='Payee'
            {...bindValue('payee')}>
            <option value='' />
            {f.map(payees, ({id, title}) => !id || !title ? null : (
              <option value={id} key={`payee-${id}`}>
                {title}
              </option>
            ))}
          </FormSelectElement>
          <FormTextElement
            label='Comment'
            {...bindValue('comment')} />
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

const TransactionForm = connect(state => ({
  categories: state.net.categories,
  accounts: state.net.accounts,
  payees: state.net.payees,
  transaction: state.net.transaction,
}))(_TransactionForm)

class _TransactionsTable extends u.ViewComponent {
  render({props: {transactions}}) {
    return (
      <div className='col-start-stretch gaps-v-0x5 padding-h-1x25 padding-v-0x75'>
        {f.map(transactions, tr => tr.incomeAmount || tr.outcomeAmount ? (
          <div className='col-start-stretch gaps-v-0x5 list-item' key={tr.id}>
            <div className='col-start-stretch gaps-v-0x25'>
              <div className='row-between-start font-midsmall'>
                <span>{tr.date}</span>
                <span>{tr.incomeAccountId || tr.outcomeAccountId}</span>
              </div>
              <div className='row-between-end'>
                <span>{tr.categoryId}</span>
                {
                  tr.incomeAmount ? <span className='fg-success'>{`+${tr.incomeAmount}`}</span> :
                  tr.outcomeAmount ? <span className='fg-danger-100'>{`-${tr.outcomeAmount}`}</span> :
                  null
                }
              </div>
            </div>
            <hr className='hr hide-in-list-last-child' />
          </div>
        ) : null)}
      </div>
    )
  }
}

const TransactionsTable = connect(state => ({transactions: state.net.transactions}))(_TransactionsTable)

class G7FormLine extends u.ViewComponent {
  render({
    context,
    props: {children},
  }) {
    if (u.isMobile(context)) {
      return (
        <div className='col-start-stretch gaps-v-0x5 mobile-form-element-spacing'>
          {children}
        </div>
      )
    }

    return (
      <div className='grid7 row-start-start form-element-spacing'>
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

class FormLabel extends u.ViewComponent {
  render({
    context,
    props: {children, className: cls, ...props},
  }) {
    if (u.isMobile(context)) {
      return (
        <label className={`row-start-center fg-black-50 ${cls || ''}`} {...props}>
          {children}:
        </label>
      )
    }

    return (
      <label className={`row-end-center fg-black-50 ${cls || ''}`} {...props}>
        {children}:
      </label>
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
    props: {label, input_type, ident, value, defaultValue, readOnly, disabled},
  }) {
    return (
      <G7FormLine>
        <FormLabel className='input-height' htmlFor={ident}>
          {label}
        </FormLabel>
        <input
          id={ident}
          name={ident}
          type={input_type || 'text'}
          className='input'
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled} />
      </G7FormLine>
    )
  }
}

class FormDateElement extends u.ViewComponent {
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
      if (year != null && month != null && day != null) {
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
    const {label, readOnly, disabled} = props
    const {years, months, days, year, month, day} = state

    return (
      <G7FormLine>
        <FormLabel className='input-height'>
          {label}
        </FormLabel>
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
      </G7FormLine>
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
    props: {label, ident, value, defaultValue, readOnly, disabled, children},
  }) {
    return (
      <G7FormLine>
        <FormLabel className='input-height' htmlFor={ident}>
          {label}
        </FormLabel>
        <select
          id={ident}
          name={ident}
          className='select-native'
          value={value}
          defaultValue={defaultValue}
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
  constructor({ident, onUpdate}) {
    super(...arguments)
    this.onChange = ({target: {value}}) => {
      if (onUpdate) onUpdate(ident, value)
    }
  }

  render({
    onChange,
    props: {ident, value, readOnly, disabled, checked, defaultChecked},
  }) {
    return (
      <label className='radio'>
        <input
          id={ident}
          name={ident}
          value={value}
          type='radio'
          className='radio-input'
          onChange={onChange}
          checked={checked}
          defaultChecked={defaultChecked}
          readOnly={readOnly}
          disabled={disabled} />
        <span className='radio-decorator' />
      </label>
    )
  }
}