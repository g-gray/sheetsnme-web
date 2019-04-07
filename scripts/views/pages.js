import React from 'react'
import {connect} from 'react-redux'
import {Switch, Route, Redirect, NavLink, Link} from 'react-router-dom'

import * as f from 'fpx'
import * as e from 'emerge'

import * as a from '../actions'
import * as u from '../utils'

import * as m from './misc'
import * as s from './svg'

class PageLayout extends u.ViewComponent {
  render({props: {className: cls, style, children}}) {
    return (
      <div className='relative col-start-stretch stretch-to-viewport-v'>
        <Navbar />
        <div className='row-start-stretch gaps-h-1'>
          <Drawer />
          <div
            className={`flex-1 ${cls || ''}`}
            style={style}
            children={children} />
        </div>
        <m.GlobalDialog />
      </div>
    )
  }
}

class MobilePageLayout extends u.ViewComponent {
  render({props: {className: cls, style, children}}) {
    return (
      <div className='relative col-start-stretch stretch-to-viewport-v'>
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

class Logo extends u.ViewComponent {
  render() {
    return (
      <span className='row-center-center padding-0x25'>
        <span className='row-center-center padding-0x25 bg-white circle'>
          <s.PieChart
            className='fg-primary-100'
            style={{fontSize: '1.5rem'}} />
        </span>
      </span>
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
        <header className='row-between-stretch bg-primary-100 navbar-height shadow-dept-1'>
          <div className='row-start-center gaps-h-0x75 padding-h-1'>
            <m.FakeButton className='row-center-center padding-0x5 circle decorate-dark-menu-item'>
              <s.Menu
                style={{fontSize: '1.5rem'}}
                onClick={() => {setDialog(MobileMenu)}} />
            </m.FakeButton>
            <span className='font-large fg-white'>Accounting</span>
          </div>
          <UserMenu />
        </header>
      )
    }

    return (
      <header className='row-between-stretch bg-primary-100 navbar-height shadow-dept-1'>
        <Link to='/' className='row-center-center gaps-h-0x75 padding-h-1 decorate-dark-menu-item'>
          <Logo />
          <span className='font-large'>Accounting</span>
        </Link>
        <UserMenu />
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
    const {firstName, lastName, pictureUrl, email} = user

    return f.isEmpty(user) ? null : (
      <div className='relative row-start-stretch'>
        <m.FakeButton
          onClick={this.toggle}
          className='relative row-start-center gaps-h-0x75 padding-h-1 decorate-dark-menu-item z-index-2'
          aria-expanded={expanded}>
          <m.CircleUserPic
            url={pictureUrl}
            size='2' />
        </m.FakeButton>
        {!expanded ? null :
        <m.Closer root={this} close={this.close}>
          <div
            className='dropdown-position z-index-1'
            onClick={this.close}>
            <div className='dropdown dropdown-padding col-start-stretch' style={{minWidth: '11rem'}}>
              <div className='row-start-center gaps-h-0x75 padding-v-0x5 padding-h-1'>
                <m.CircleUserPic
                  url={pictureUrl}
                  size='4' />
                <div className='col-start-stretch gaps-v-0x5'>
                  <div className='col-start-stretch'>
                    <span className='weight-medium wspace-nowrap'>
                      {`${firstName || ''} ${lastName || ''}`}
                    </span>
                    {!email ? null :
                    <span className='font-midsmall'>
                      {email}
                    </span>}
                  </div>
                  <div className='row-start-center'>
                    <a href='/auth/logout' className='btn-secondary'>
                      Logout
                    </a>
                  </div>
                </div>
              </div>
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

  render({close}) {
    return (
      <m.Dialog onEscape={close}>
        <m.DialogScrollable className='row-start-stretch bg-overlay-dark fade-in-fast' onClick={close}>
          <div className='relative col-start-stretch gaps-v-0x5 bg-white slide-in-left-fast' onClick={close}>
            <div className='row-start-center padding-h-1 bg-primary-100 navbar-height'>
              <Logo />
            </div>
            <Drawer />
          </div>
        </m.DialogScrollable>
      </m.Dialog>
    )
  }
}

const MobileMenu = connect(null, dispatch => ({
  setDialog: dialog => dispatch(a.setDialog(dialog)),
}))(_MobileMenu)

class _Drawer extends u.ViewComponent {
  render({props: {transactions}}) {
    return (
      <aside className='col-start-stretch gaps-v-0x5 padding-h-0x5 padding-v-1' style={{width: '16rem'}}>
        <div className='col-start-stretch'>
          <NavLink
            to='/'
            exact
            className='drawer-link decorate-drawer-link'>
            <s.BarChart className='drawer-icon font-large' />
            <span>Transactions</span>
            <span className='flex-1 text-right'>
              {transactions.length || ''}
            </span>
          </NavLink>
        </div>
        <hr className='hr' />
        <div className='col-start-stretch'>
          <NavLink
            to='/settings/categories'
            exact
            className='drawer-link decorate-drawer-link'>
            <s.Tag className='drawer-icon font-large' />
            <span>Categories</span>
          </NavLink>
          <NavLink
            to='/settings/accounts'
            exact
            className='drawer-link decorate-drawer-link'>
            <s.CreditCard className='drawer-icon font-large' />
            <span>Accounts</span>
          </NavLink>
          <NavLink
            to='/settings/payees'
            exact
            className='drawer-link decorate-drawer-link'>
            <s.Users className='drawer-icon font-large' />
            <span>Payees</span>
          </NavLink>
        </div>
      </aside>
    )
  }
}

const Drawer = connect(state => ({
  transactions: state.net.transactions,
}))(_Drawer)

export class HomePage extends u.ViewComponent {
  render({context}) {
    if (u.isMobile(context)) {
      return (
        <MobilePageLayout>
          <div className='col-start-stretch'>
            <TransactionsList />
          </div>
        </MobilePageLayout>
      )
    }

    return (
      <PageLayout className='col-start-center padding-r-1x25'>
        <div className='limit-content-width col-start-stretch'>
          <TransactionsList />
        </div>
      </PageLayout>
    )
  }
}

class _SettingsPage extends u.ViewComponent {
  render({context}) {
    if (u.isMobile(context)) {
      return (
        <MobilePageLayout>
          <div className='col-start-stretch padding-v-0x5'>
            <Switch>
              <Route path='/settings/categories'>
                <CategoriesTable />
              </Route>
              <Route path='/settings/accounts'>
                <AccountsTable />
              </Route>
              <Route path='/settings/payees'>
                <PayeesTable />
              </Route>
              <Redirect from='/settings' to='settings/categories' />
            </Switch>
          </div>
        </MobilePageLayout>
      )
    }

    return (
      <PageLayout>
        <div className='col-start-stretch padding-v-0x5 padding-r-1x25'>
          <Switch>
            <Route path='/settings/categories'>
              <CategoriesTable />
            </Route>
            <Route path='/settings/accounts'>
              <AccountsTable />
            </Route>
            <Route path='/settings/payees'>
              <PayeesTable />
            </Route>
            <Redirect from='/settings' to='settings/categories' />
          </Switch>
        </div>
      </PageLayout>
    )
  }
}

export const SettingsPage = connect(state => ({
  payees: state.net.payees,
}))(_SettingsPage)

class _CategoriesTable extends u.ViewComponent {
  render({props: {categories}}) {
    return (
      <div className='data-table'>
        <div className='data-table-row fg-black-50'>
          <div className='data-table-head'>Title</div>
        </div>
        {f.map(categories, cat => (
          <div className='data-table-row' key={cat.id}>
            <div className='data-table-cell wspace-nowrap'>
              {cat.title}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

const CategoriesTable = connect(state => ({
  categories: state.net.categories,
}))(_CategoriesTable)

class _AccountsTable extends u.ViewComponent {
  render({
    context,
    props: {accounts},
  }) {
    if (u.isMobile(context)) {
      return (
        <div className='data-table'>
          <div className='data-table-row fg-black-50'>
            <div className='data-table-head'>Title</div>
            <div className='data-table-head text-right'>Initial Rate</div>
          </div>
          {f.map(accounts, acc => (
            <div className='data-table-row' key={acc.id}>
              <div className='data-table-cell wspace-nowrap'>
                {acc.title}
              </div>
              <div className='data-table-cell wspace-nowrap text-right'>
                {acc.initial}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className='data-table'>
        <div className='data-table-row fg-black-50'>
          <div className='data-table-head'>Title</div>
          <div className='data-table-head'>Initial Rate</div>
          <div className='data-table-head'>Currency Code</div>
          <div className='data-table-head'>RUB Rate</div>
        </div>
        {f.map(accounts, acc => (
          <div className='data-table-row' key={acc.id}>
            <div className='data-table-cell wspace-nowrap'>
              {acc.title}
            </div>
            <div className='data-table-cell wspace-nowrap'>
              {acc.initial}
            </div>
            <div className='data-table-cell wspace-nowrap'>
              {acc.currencyCode}
            </div>
            <div className='data-table-cell wspace-nowrap'>
              {acc.rubRate}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

const AccountsTable = connect(state => ({
  accounts: state.net.accounts,
}))(_AccountsTable)

class _PayeesTable extends u.ViewComponent {
  render({props: {payees}}) {
    return (
      <div className='data-table'>
        <div className='data-table-row fg-black-50'>
          <div className='data-table-head'>Title</div>
        </div>
        {f.map(payees, payee => (
          <div className='data-table-row' key={payee.id}>
            <div className='data-table-cell wspace-nowrap'>
              {payee.title}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

const PayeesTable = connect(state => ({
  payees: state.net.payees,
}))(_PayeesTable)

class _TransactionDialog extends u.ViewComponent {
  constructor(props) {
    super(props)

    this.close = () => {
      this.props.setDialog(null)
      this.props.setTransaction(null)
    }
  }

  render({
    close,
    context,
    props: {transaction},
  }) {
    if (u.isMobile(context)) {
      return (
        <m.Dialog onEscape={close}>
          <m.DialogScrollable className='col-start-stretch'>
            <div className='flex-1 relative col-start-stretch bg-white'>
              <div className='row-between-center gaps-h-1 padding-l-1x25 navbar-height'>
                <h2 className='font-large weight-medium'>
                  {transaction && transaction.id ? 'Edit' : 'New'} transaction
                </h2>
                <m.FakeButton className='row-center-center padding-1x25' onClick={close}>
                  <s.X className='font-large' />
                </m.FakeButton>
              </div>
              <hr className='hr' />
              <TransactionForm onSubmit={close} />
            </div>
          </m.DialogScrollable>
        </m.Dialog>
      )
    }

    return (
      <m.Dialog onEscape={close}>
        <m.DialogOverlay className='bg-overlay-dark' />
        <m.DialogCentered onClick={close}>
          <div className='col-start-stretch rounded bg-white shadow-dept-3'>
            <div className='row-between-center gaps-h-1 padding-h-1x25 navbar-height'>
              <h2 className='font-large weight-medium'>
                {transaction && transaction.id ? 'Edit' : 'New'} transaction
              </h2>
              <m.FakeButton className='row-center-center' onClick={close}>
                <s.X className='font-large' />
              </m.FakeButton>
            </div>
            <hr className='hr' />
            <TransactionForm onSubmit={close} />
          </div>
        </m.DialogCentered>
      </m.Dialog>
    )
  }
}

const TransactionDialog = connect(state => ({
  transaction: state.net.transaction,
}), dispatch => ({
  setTransaction: transaction => dispatch(a.receiveTransaction(transaction)),
  setDialog: dialog => dispatch(a.setDialog(dialog)),
}))(_TransactionDialog)

class _TransactionForm extends u.ViewComponent {
  constructor(props) {
    super(props)

    this.state = {formValues: this.props.transaction || {
      date: u.formatDate(new Date()),
    }}

    this.onSubmit = event => {
      u.preventDefault(event)

      const {formValues} = this.state

      if (formValues.id) {
        this.props.updateTransaction(this.state.formValues, formValues.id)
      }
      else {
        this.props.createTransaction(this.state.formValues)
      }

      if (this.props.onSubmit) this.props.onSubmit(event)
    }

    this.onUpdate = (key, value) => {
      this.setState({formValues: e.put(this.state.formValues, key, value)})
    }

    this.onAmountUpdate = (__, value) => {
      const {incomeAmount, incomeAccountId} = this.state.formValues

      const amountType = incomeAmount || incomeAccountId ? 'incomeAmount' : 'outcomeAmount'

      this.setState({formValues: e.put(this.state.formValues, amountType, value)})
    }

    this.onAccountUpdate = (__, value) => {
      const {incomeAmount, incomeAccountId} = this.state.formValues

      const accountType = incomeAmount || incomeAccountId ? 'incomeAmountId' : 'outcomeAmountId'

      this.setState({formValues: e.put(this.state.formValues, accountType, value)})
    }

    this.onTypeUpdate = () => {
      const {
        outcomeAmount,
        incomeAmount,
        outcomeAccountId,
        incomeAccountId,
      } = this.state.formValues

      this.setState({formValues: e.patch(this.state.formValues, {
        outcomeAmount: incomeAmount,
        incomeAmount: outcomeAmount,
        outcomeAccountId: incomeAccountId,
        incomeAccountId: outcomeAccountId,
      })})
    }

    this.bindValue = key => ({
      ident: key,
      onUpdate: this.onUpdate,
      defaultValue: this.state.formValues[key],
    })
  }

  render({
    bindValue,
    context,
    state: {formValues},
    props: {categories, accounts, payees},
  }) {
    const isMobile = u.isMobile(context)

    return (
      <form className='col-start-stretch' onSubmit={this.onSubmit}>
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
                  onUpdate={this.onTypeUpdate}
                  defaultChecked={!formValues.incomeAmount} />
                <span>Outcome</span>
              </label>
              <label className='row-start-center gaps-h-0x5'>
                <Radio
                  ident='type'
                  value='income'
                  onUpdate={this.onTypeUpdate}
                  defaultChecked={formValues.incomeAmount} />
                <span>Income</span>
              </label>
            </div>
          </G7FormLine>
          <FormTextElement
            label='Amount'
            ident='amount'
            onUpdate={this.onAmountUpdate}
            defaultValue={formValues.outcomeAmount || formValues.incomeAmount} />
          <FormSelectElement
            label='Account'
            ident='accountId'
            onUpdate={this.onAccountUpdate}
            defaultValue={formValues.outcomeAccountId || formValues.incomeAccountId}>
            <option value='' />
            {f.map(accounts, ({id, title}) => (
              <option value={id} key={`account-${id}`}>
                {title}
              </option>
            ))}
          </FormSelectElement>
          <FormSelectElement
            label='Category'
            {...bindValue('categoryId')}>
            <option value='' />
            {f.map(categories, ({id, title}) => (
              <option value={id} key={`category-${id}`}>
                {title}
              </option>
            ))}
          </FormSelectElement>
          <FormSelectElement
            label='Payee'
            {...bindValue('payeeId')}>
            <option value='' />
            {f.map(payees, ({id, title}) => (
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
}), dispatch => ({
  createTransaction: transaction => dispatch(a.createTransaction(transaction)),
  updateTransaction: (transaction, id) => dispatch(a.updateTransaction(transaction, id)),
}))(_TransactionForm)

class _TransactionsList extends u.ViewComponent {
  render({
    context,
    props: {categoriesById, accountsById, payeesById, transactions, setTransaction, setDialog},
  }) {
    const isMobile = u.isMobile(context)

    return (
      <div className={`relative col-start-stretch ${isMobile ? '' : 'gaps-v-1'}`}>
        {isMobile ? null :
        <div className='col-start-stretch padding-h-0x5' style={{marginTop: '-1.75rem'}}>
          <Fab onClick={() => setDialog(TransactionDialog)} />
        </div>}
        {!isMobile ? null :
        <Fab
          className='fix-b-r margin-1'
          onClick={() => setDialog(TransactionDialog)} />}
        <div className='col-start-stretch'>
          {f.map(transactions, tr => (
            <m.FakeButton
              type='div'
              key={tr.id}
              onClick={() => {
                setTransaction(tr)
                setDialog(TransactionDialog)
              }}
              className='row-start-center gaps-h-1 padding-h-1 list-item text-left theme-light-menu-busy'>
              {
                tr.incomeAmount ?
                <div className='relative width-2x5 square circle bg-success'>
                  <div className='row-center-center abs-center fg-white font-large'>
                    {f.scan(categoriesById, tr.categoryId, 'title', 0) || <s.Plus />}
                  </div>
                </div> :
                tr.outcomeAmount ?
                <div className='relative width-2x5 square circle bg-warning-100'>
                  <div className='row-center-center abs-center fg-white font-large'>
                    {f.scan(categoriesById, tr.categoryId, 'title', 0) || <s.Minus />}
                  </div>
                </div> :
                <div className='relative width-2x5 square circle bg-accent'>
                  <div className='row-center-center abs-center fg-white font-large'>!</div>
                </div>
              }
              <div className='flex-1 col-start-stretch'>
                <div className='row-between-center gaps-h-1 padding-v-1'>
                  <div className='col-start-stretch'>
                    <span>
                      {
                        tr.incomeAmount && f.scan(payeesById, tr.payeeId, 'title') ?
                        <span>{f.scan(payeesById, tr.payeeId, 'title')}&nbsp;> </span> : null
                      }
                      {
                        f.scan(categoriesById, tr.categoryId, 'title') ||
                        <i className='fg-black-35'>Without category</i>
                      }
                      {
                        tr.outcomeAmount && f.scan(payeesById, tr.payeeId, 'title') ?
                        <span> >&nbsp;{f.scan(payeesById, tr.payeeId, 'title')}</span> : null
                      }
                    </span>
                    <span className='font-midsmall fg-black-50'>
                      {tr.date} {tr.date && tr.comment ? '·' : ''} {tr.comment}
                    </span>
                  </div>
                  <div className='col-start-stretch text-right wspace-nowrap'>
                    {
                      tr.incomeAmount ? <span className='fg-success'>{`+${tr.incomeAmount}`}</span> :
                      tr.outcomeAmount ? <span>{`-${tr.outcomeAmount}`}</span> : null
                    }
                    <span className='font-midsmall fg-black-50'>
                      {f.scan(accountsById, tr.incomeAccountId || tr.outcomeAccountId, 'title')}
                    </span>
                  </div>
                </div>
                <hr className='hr hide-in-list-last-child' />
              </div>
            </m.FakeButton>
          ))}
        </div>
      </div>
    )
  }
}

const TransactionsList = connect(state => ({
  categoriesById: state.net.categoriesById,
  accountsById: state.net.accountsById,
  payeesById: state.net.payeesById,
  transactions: state.net.transactions,
}), dispatch => ({
  setTransaction: transaction => dispatch(a.receiveTransaction(transaction)),
  setDialog: dialog => dispatch(a.setDialog(dialog)),
}))(_TransactionsList)

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

class Fab extends u.ViewComponent {
  render({props: {className: cls, ...props}}) {
    return (
      <m.FakeButton
        className={`row-start-stretch width-3x5 ${cls || ''}`}
        {...props}>
        <span className='flex-1 relative circle square bg-accent shadow-dept-2'>
          <s.Plus className='abs-center font-large fg-white' />
        </span>
      </m.FakeButton>
    )
  }
}
