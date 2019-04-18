import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {NavLink, Link} from 'react-router-dom'

import * as f from 'fpx'

import * as a from '../actions'
import * as u from '../utils'

import * as m from './misc'
import * as s from './svg'

class PageLayout extends u.ViewComponent {
  render({
    props: {className: cls, style, children},
  }) {
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
        <div className='fix-b-l z-index-tooltip width-100p row-start-center padding-0x5'>
          <Notifications />
        </div>
        <m.GlobalDialog />
      </div>
    )
  }
}

class _MobilePageLayout extends u.ViewComponent {
  render({
    props: {className: cls, style, children, action, dialogs},
  }) {
    return (
      <div className='relative col-start-stretch stretch-to-viewport-v'>
        <Navbar />
        <div
          className={`flex-1 ${cls || ''}`}
          style={style}
          children={children} />
        <div className='fix-b-l z-index-tooltip width-100p col-start-stretch gaps-v-0x5 padding-0x5'>
          <Notifications />
          {!action || dialogs ? null :
          <div className='row-end-center padding-0x5'>
            {action}
          </div>}
        </div>
        <m.GlobalDialog />
      </div>
    )
  }
}

const MobilePageLayout = connect(state => ({
  dialogs: state.dom.dialogs,
}))(_MobilePageLayout)



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
  constructor() {
    super(...arguments)

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
  constructor() {
    super(...arguments)

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
  constructor() {
    super(...arguments)

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
            to='/categories'
            exact
            className='drawer-link decorate-drawer-link'>
            <s.Tag className='drawer-icon font-large' />
            <span>Categories</span>
          </NavLink>
          <NavLink
            to='/accounts'
            exact
            className='drawer-link decorate-drawer-link'>
            <s.CreditCard className='drawer-icon font-large' />
            <span>Accounts</span>
          </NavLink>
          <NavLink
            to='/payees'
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

class Snackbar extends u.ViewComponent {
  render({props: {children, action}}) {
    return action ? (
      <div className='row-start-center padding-l-1 padding-v-0x25 snackbar'>
        <div className='col-start-stretch'>{children}</div>
        <div className='row-start-center padding-h-0x5'>
          {action}
        </div>
      </div>
    ) : (
      <div className='row-start-center padding-h-1 padding-v-0x75 snackbar'>
        {children}
      </div>
    )
  }
}

class _Notifications extends u.ViewComponent {
  componentWillUnmount() {
    if (this.timeoutId) clearTimeout(this.timeoutId)
  }

  render({props: {notifications, dispatch}}) {
    const notification = notifications[0]

    if (notification) {
      if (notification.timeout) {
        this.timeoutId = setTimeout(() => {
          dispatch(a.removeNotification(notification.time))
        }, notification.timeout)
      }

      return (
        <Snackbar>
          <div>
            {notification.messages ?
              f.map(notification.messages, ({text}, index) => (
                <p key={`notification-${index}`}>{text}</p>
              )) : notification.text}
          </div>
        </Snackbar>
      )
    }

    return null
  }
}

const Notifications = connect(state => ({
  notifications: state.dom.notifications,
}))(_Notifications)



class ListPage extends u.ViewComponent {
  render({
    context,
    props: {action, children},
  }) {
    if (u.isMobile(context)) {
      return (
        <MobilePageLayout action={action}>
          <div className='col-start-stretch padding-v-0x5'>
            {children}
          </div>
        </MobilePageLayout>
      )
    }

    return (
      <PageLayout className='relative col-start-center padding-r-1x25'>
        <div className='limit-content-width col-start-stretch gaps-v-1'>
          <div className='col-start-stretch padding-h-0x5' style={{marginTop: '-1.75rem'}}>
            {action}
          </div>
          {children}
        </div>
      </PageLayout>
    )
  }
}

export class HomePage extends u.ViewComponent {
  render(__, {dispatch}) {
    const action = (
      <Fab
        onClick={() => dispatch(a.setDialog(FormDialog, {
          form: TransactionForm,
          title: 'New transaction',
          onClose: transaction => dispatch(a.receiveTransaction(transaction)),
        }))} />
    )

    return (
      <ListPage action={action}>
        <TransactionsList />
      </ListPage>
    )
  }
}

export class CategoriesPage extends u.ViewComponent {
  render(__, {dispatch}) {
    const action = (
      <Fab
        onClick={() => dispatch(a.setDialog(FormDialog, {
          form: CategoryForm,
          title: 'New category',
          onClose: category => dispatch(a.receiveCategory(category)),
        }))} />
    )

    return (
      <ListPage action={action}>
        <CategoriesList />
      </ListPage>
    )
  }
}

export class AccountsPage extends u.ViewComponent {
  render(__, {dispatch}) {
    const action = (
      <Fab
        onClick={() => dispatch(a.setDialog(FormDialog, {
          form: AccountForm,
          title: 'New account',
          onClose: account => dispatch(a.receiveAccount(account)),
        }))} />
    )

    return (
      <ListPage action={action}>
        <AccountsList />
      </ListPage>
    )
  }
}

export class PayeesPage extends u.ViewComponent {
  render(__, {dispatch}) {
    const action = (
      <Fab
        onClick={() => dispatch(a.setDialog(FormDialog, {
          form: PayeeForm,
          title: 'New payee',
          onClose: payee => dispatch(a.receivePayee(payee)),
        }))} />
    )

    return (
      <ListPage action={action}>
        <PayeesList />
      </ListPage>
    )
  }
}



class _CategoryForm extends u.ViewComponent {
  constructor() {
    super(...arguments)

    this.state = {formValues: this.props.category || {}}

    this.onSubmit = event => {
      u.preventDefault(event)

      this.setState({errors: null})

      const {dispatch} = this.props
      const {formValues} = this.state

      const promise = formValues.id
        ? dispatch(a.updateCategory(this.state.formValues, formValues.id))
        : dispatch(a.createCategory(this.state.formValues))

      promise
        .catch(errors => {
          this.setState({errors})
          return window.Promise.reject(errors)
        })
        .then(() => {
          if (this.props.onSubmitSuccess) this.props.onSubmitSuccess(event)
        })
        .then(() => dispatch(a.notify({text: `Category ${formValues.id ? 'saved' : 'added'}`})))
        .then(() => dispatch(a.receiveCategory()))
        .then(() => dispatch(a.fetchCategories()))
    }
  }

  render({
    context,
    state: {errors},
  }) {
    const isMobile = u.isMobile(context)

    return (
      <form className='col-start-stretch' onSubmit={this.onSubmit}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <FormTextElement
            name='title'
            label='Name'
            {...u.bindValue(this, ['formValues', 'title'])} />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-center-center padding-v-1 padding-h-1x25'>
          <button
            type='submit'
            className='btn-primary btn-wide'>
            Submit
          </button>
        </div>
        {!errors ? null :
        <hr className='hr margin-h-1x25' />}
        <FormErrors errors={errors} />
      </form>
    )
  }
}

const CategoryForm = connect(state => ({
  category: state.net.category,
}))(_CategoryForm)

class _CategoriesList extends u.ViewComponent {
  render({
    props: {categories, setDialog, setCategory},
  }) {
    return (
      <div className='col-start-stretch'>
        {f.map(categories, cat => (
          <m.FakeButton
            type='div'
            key={cat.id}
            onClick={() => {
              setCategory(cat)
              setDialog(FormDialog, {
                form: CategoryForm,
                title: 'Edit category',
                onClose: setCategory,
              })
            }}
            className='row-start-stretch gaps-h-1 padding-h-1 text-left theme-light-menu-busy'>
            <div className='relative width-2x5 square'>
              <div className='row-center-center abs-center'>
                <s.Tag className='font-large fg-primary-100' />
              </div>
            </div>
            <div className='flex-1 col-start-stretch'>
              <div className='flex-1 row-between-center padding-v-1'>
                {cat.title}
              </div>
            </div>
          </m.FakeButton>
        ))}
      </div>
    )
  }
}

const CategoriesList = connect(state => ({
  categories: state.net.categories,
}), dispatch => ({
  setCategory: category => dispatch(a.receiveCategory(category)),
  setDialog: (dialog, props) => dispatch(a.setDialog(dialog, props)),
}))(_CategoriesList)



class _AccountForm extends u.ViewComponent {
  constructor() {
    super(...arguments)

    this.state = {formValues: this.props.account || {}}

    this.onSubmit = event => {
      u.preventDefault(event)

      this.setState({errors: null})

      const {dispatch} = this.props
      const {formValues} = this.state

      const promise = formValues.id
        ? dispatch(a.updateAccount(this.state.formValues, formValues.id))
        : dispatch(a.createAccount(this.state.formValues))

      promise
        .catch(errors => {
          this.setState({errors})
          return window.Promise.reject(errors)
        })
        .then(() => {
          if (this.props.onSubmitSuccess) this.props.onSubmitSuccess(event)
        })
        .then(() => dispatch(a.notify({text: `Account ${formValues.id ? 'saved' : 'added'}`})))
        .then(() => dispatch(a.receiveAccount()))
        .then(() => dispatch(a.fetchAccounts()))
    }
  }

  render({
    context,
    state: {errors},
  }) {
    const isMobile = u.isMobile(context)

    return (
      <form className='col-start-stretch' onSubmit={this.onSubmit}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <FormTextElement
            name='title'
            label='Name'
            {...u.bindValue(this, ['formValues', 'title'])} />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-center-center padding-v-1 padding-h-1x25'>
          <button
            type='submit'
            className='btn-primary btn-wide'>
            Submit
          </button>
        </div>
        {!errors ? null :
        <hr className='hr margin-h-1x25' />}
        <FormErrors errors={errors} />
      </form>
    )
  }
}

const AccountForm = connect(state => ({
  account: state.net.account,
}))(_AccountForm)

class _AccountsList extends u.ViewComponent {
  render({
    props: {accounts, setDialog, setAccount},
  }) {
    return (
      <div className='col-start-stretch'>
        {f.map(accounts, acc => (
          <m.FakeButton
            type='div'
            key={acc.id}
            onClick={() => {
              setAccount(acc)
              setDialog(FormDialog, {
                form: AccountForm,
                title: 'Edit account',
                onClose: setAccount,
              })
            }}
            className='row-start-stretch gaps-h-1 padding-h-1 text-left theme-light-menu-busy'>
            <div className='relative width-2x5 square'>
              <div className='row-center-center abs-center'>
                <s.CreditCard className='font-large fg-primary-100' />
              </div>
            </div>
            <div className='flex-1 col-start-stretch'>
              <div className='flex-1 row-between-center gaps-h-1 padding-v-1'>
                <span>{acc.title}</span>
                <span className='fg-black-50'>{acc.balance}</span>
              </div>
            </div>
          </m.FakeButton>
        ))}
      </div>
    )
  }
}

const AccountsList = connect(state => ({
  accounts: state.net.accounts,
}), dispatch => ({
  setAccount: account => dispatch(a.receiveAccount(account)),
  setDialog: (dialog, props) => dispatch(a.setDialog(dialog, props)),
}))(_AccountsList)



class _PayeeForm extends u.ViewComponent {
  constructor() {
    super(...arguments)

    this.state = {formValues: this.props.payee || {}}

    this.onSubmit = event => {
      u.preventDefault(event)

      this.setState({errors: null})

      const {dispatch} = this.props
      const {formValues} = this.state

      const promise = formValues.id
        ? dispatch(a.updatePayee(this.state.formValues, formValues.id))
        : dispatch(a.createPayee(this.state.formValues))

      promise
        .catch(errors => {
          this.setState({errors})
          return window.Promise.reject(errors)
        })
        .then(() => {
          if (this.props.onSubmitSuccess) this.props.onSubmitSuccess(event)
        })
        .then(() => dispatch(a.notify({text: `Payee ${formValues.id ? 'saved' : 'added'}`})))
        .then(() => dispatch(a.receivePayee()))
        .then(() => dispatch(a.fetchPayees()))
    }
  }

  render({
    context,
    state: {errors},
  }) {
    const isMobile = u.isMobile(context)

    return (
      <form className='col-start-stretch' onSubmit={this.onSubmit}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <FormTextElement
            name='title'
            label='Name'
            {...u.bindValue(this, ['formValues', 'title'])} />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-center-center padding-v-1 padding-h-1x25'>
          <button
            type='submit'
            className='btn-primary btn-wide'>
            Submit
          </button>
        </div>
        {!errors ? null :
        <hr className='hr margin-h-1x25' />}
        <FormErrors errors={errors} />
      </form>
    )
  }
}

const PayeeForm = connect(state => ({
  payee: state.net.payee,
}))(_PayeeForm)

class _PayeesList extends u.ViewComponent {
  render({
    props: {payees, setDialog, setPayee},
  }) {
    return (
      <div className='col-start-stretch'>
        {f.map(payees, payee => (
          <m.FakeButton
            type='div'
            key={payee.id}
            onClick={() => {
              setPayee(payee)
              setDialog(FormDialog, {
                form: PayeeForm,
                title: 'Edit payee',
                onClose: setPayee,
              })
            }}
            className='row-start-stretch gaps-h-1 padding-h-1 text-left theme-light-menu-busy'>
            <div className='relative width-2x5 square'>
              <div className='row-center-center abs-center'>
                <s.Users className='font-large fg-primary-100' />
              </div>
            </div>
            <div className='flex-1 col-start-stretch'>
              <div className='flex-1 row-between-center gaps-h-1 padding-v-1'>
                <span>{payee.title}</span>
              </div>
            </div>
          </m.FakeButton>
        ))}
      </div>
    )
  }
}

const PayeesList = connect(state => ({
  payees: state.net.payees,
}), dispatch => ({
  setPayee: payee => dispatch(a.receivePayee(payee)),
  setDialog: (dialog, props) => dispatch(a.setDialog(dialog, props)),
}))(_PayeesList)



class _FormDialog extends u.ViewComponent {
  constructor() {
    super(...arguments)

    this.close = () => {
      this.props.setDialog()

      if (this.props.onClose) this.props.onClose()
    }
  }

  render({
    close,
    context,
    props: {title, form: Form},
  }) {
    if (u.isMobile(context)) {
      return (
        <m.Dialog onEscape={close}>
          <m.DialogScrollable className='col-start-stretch'>
            <div className='flex-1 relative col-start-stretch bg-white'>
              <div className='row-between-center gaps-h-1 padding-l-1x25 navbar-height'>
                <h2 className='font-large weight-medium'>
                  {title}
                </h2>
                <m.FakeButton className='row-center-center padding-1x25' onClick={close}>
                  <s.X className='font-large' />
                </m.FakeButton>
              </div>
              <hr className='hr' />
              {!Form ? null :
              <Form onSubmitSuccess={close} />}
            </div>
          </m.DialogScrollable>
        </m.Dialog>
      )
    }

    return (
      <m.Dialog onEscape={close}>
        <m.DialogOverlay className='bg-overlay-dark' />
        <m.DialogCentered onClick={close}>
          <div
            className='col-start-stretch rounded bg-white shadow-dept-3'
            style={{minWidth: '31rem'}}>
            <div className='row-between-center gaps-h-1 padding-h-1x25 navbar-height'>
              <h2 className='font-large weight-medium'>
                {title}
              </h2>
              <m.FakeButton className='row-center-center' onClick={close}>
                <s.X className='font-large' />
              </m.FakeButton>
            </div>
            <hr className='hr' />
            {!Form ? null :
            <Form onSubmitSuccess={close} />}
          </div>
        </m.DialogCentered>
      </m.Dialog>
    )
  }
}

const FormDialog = connect(null, dispatch => ({
  setDialog: dialog => dispatch(a.setDialog(dialog)),
}))(_FormDialog)



const OUTCOME  = 'outcome'
const INCOME   = 'income'
const TRANSFER = 'transfer'

class _TransactionForm extends u.ViewComponent {
  constructor() {
    super(...arguments)

    const transaction = this.props.transaction || {date: u.formatDate(new Date())}

    this.state = {
      type: defineTransactionType(transaction),
      formValues: transaction,
    }

    this.onSubmit = event => {
      u.preventDefault(event)

      this.setState({errors: null})

      const {dispatch} = this.props
      const {formValues, type} = this.state
      const date = u.formatDate(this.state.formValues.date)

      let data = type === OUTCOME
        ? {...formValues, incomeAccountId: '', incomeAmount: 0}
        : type === INCOME
        ? {...formValues, outcomeAccountId: '', outcomeAmount: 0}
        : type === TRANSFER
        ? {...formValues, categoryById: '', payeeId: ''}
        : formValues
      data = {...data, date}

      const promise = formValues.id
        ? dispatch(a.updateTransaction(data, formValues.id))
        : dispatch(a.createTransaction(data))

      promise
        .catch(errors => {
          this.setState({errors})
          return window.Promise.reject(errors)
        })
        .then(() => {
          if (this.props.onSubmitSuccess) this.props.onSubmitSuccess(event)
        })
        .then(() => dispatch(a.notify({text: `Transaction ${formValues.id ? 'saved' : 'added'}`})))
        .then(() => dispatch(a.receiveTransaction()))
        .then(() => dispatch(a.fetchTransactions()))
    }

    this.onTypeUpdated = value => {
      const {formValues, type} = this.state
      const {outcomeAccountId, outcomeAmount, incomeAccountId, incomeAmount} = formValues

      if (type === OUTCOME && value === INCOME) {
        this.setState({
          type: value,
          formValues: {
            ...formValues,
            incomeAccountId : outcomeAccountId,
            incomeAmount    : outcomeAmount,
            outcomeAccountId: incomeAccountId,
            outcomeAmount   : incomeAmount,
          },
        })
        return
      }

      if (type === INCOME && value === OUTCOME) {
        this.setState({
          type: value,
          formValues: {
            ...formValues,
            outcomeAccountId: incomeAccountId,
            outcomeAmount   : incomeAmount,
            incomeAccountId : outcomeAccountId,
            incomeAmount    : outcomeAmount,
          },
        })
        return
      }

      if (type === OUTCOME && value === TRANSFER) {
        this.setState({
          type: value,
          formValues: {...formValues, incomeAmount: outcomeAmount},
        })
        return
      }

      if (type === INCOME && value === TRANSFER) {
        this.setState({
          type: value,
          formValues: {...formValues, outcomeAmount: incomeAmount},
        })
        return
      }

      this.setState({type: value})
    }
  }

  render({
    context,
    state: {errors},
    props: {categories, accounts, payees},
  }) {
    const isMobile = u.isMobile(context)

    return (
      <form className='col-start-stretch' onSubmit={this.onSubmit}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <FormDateElement
            name='date'
            label='Date'
            {...u.bindValue(this, ['formValues', 'date'])} />
          <G7FormLine>
            <FormLabel>
              Type
            </FormLabel>
            <div className={isMobile ? 'col-start-stretch gaps-v-0x5' : 'row-start-center gaps-h-1'}>
              <label className='row-start-center gaps-h-0x5'>
                <Radio
                  name='type'
                  {...u.bindChecked(this, ['type'], OUTCOME)}
                  onUpdate={this.onTypeUpdated} />
                <span>Outcome</span>
              </label>
              <label className='row-start-center gaps-h-0x5'>
                <Radio
                  name='type'
                  {...u.bindChecked(this, ['type'], INCOME)}
                  onUpdate={this.onTypeUpdated} />
                <span>Income</span>
              </label>
              <label className='row-start-center gaps-h-0x5'>
                <Radio
                  name='type'
                  {...u.bindChecked(this, ['type'], TRANSFER)}
                  onUpdate={this.onTypeUpdated} />
                <span>Transfer</span>
              </label>
            </div>
          </G7FormLine>

          {this.state.type !== OUTCOME ? null :
          <Fragment>
            <FormTextElement
              name='outcomeAmount'
              label='Amount'
              {...u.bindValue(this, ['formValues', 'outcomeAmount'], u.parseNum)} />
            <FormSelectElement
              name='outcomeAccountId'
              label='Account'
              {...u.bindValue(this, ['formValues', 'outcomeAccountId'])}>
              <option value='' />
              {f.map(accounts, ({id, title}) => (
                <option value={id} key={`outcome-account-${id}`}>
                  {title}
                </option>
              ))}
            </FormSelectElement>
          </Fragment>}

          {this.state.type !== INCOME ? null :
          <Fragment>
            <FormTextElement
              name='incomeAmount'
              label='Amount'
              {...u.bindValue(this, ['formValues', 'incomeAmount'], u.parseNum)} />
            <FormSelectElement
              name='incomeAccountId'
              label='Account'
              {...u.bindValue(this, ['formValues', 'incomeAccountId'])}>
              <option value='' />
              {f.map(accounts, ({id, title}) => (
                <option value={id} key={`income-account-${id}`}>
                  {title}
                </option>
              ))}
            </FormSelectElement>
          </Fragment>}

          {this.state.type !== TRANSFER ? null :
          <Fragment>
            <FormTextElement
              name='outcomeAmount'
              label='Amount'
              {...u.bindValue(this, ['formValues', 'outcomeAmount'], u.parseNum)} />
            <FormSelectElement
              name='outcomeAccountId'
              label='Account'
              {...u.bindValue(this, ['formValues', 'outcomeAccountId'])}>
              <option value='' />
              {f.map(accounts, ({id, title}) => (
                <option value={id} key={`outcome-account-${id}`}>
                  {title}
                </option>
              ))}
            </FormSelectElement>
            <G7FormLine>
              <span />
              <span className='row-center-center'>
                <s.ArrowDown className='font-large' />
              </span>
            </G7FormLine>
            <FormTextElement
              name='incomeAmount'
              label='Amount'
              {...u.bindValue(this, ['formValues', 'incomeAmount'], u.parseNum)} />
            <FormSelectElement
              name='incomeAccountId'
              label='Account'
              {...u.bindValue(this, ['formValues', 'incomeAccountId'])}>
              <option value='' />
              {f.map(accounts, ({id, title}) => (
                <option value={id} key={`income-account-${id}`}>
                  {title}
                </option>
              ))}
            </FormSelectElement>
          </Fragment>}

          {!f.includes([OUTCOME, INCOME], this.state.type) ? null :
          <Fragment>
            <FormSelectElement
              name='categoryId'
              label='Category'
              {...u.bindValue(this, ['formValues', 'categoryId'])}>
              <option value='' />
              {f.map(categories, ({id, title}) => (
                <option value={id} key={`category-${id}`}>
                  {title}
                </option>
              ))}
            </FormSelectElement>
            <FormSelectElement
              name='payeeId'
              label='Payee'
              {...u.bindValue(this, ['formValues', 'payeeId'])}>
              <option value='' />
              {f.map(payees, ({id, title}) => (
                <option value={id} key={`payee-${id}`}>
                  {title}
                </option>
              ))}
            </FormSelectElement>
            <FormTextElement
              name='comment'
              label='Comment'
              {...u.bindValue(this, ['formValues', 'comment'])} />
          </Fragment>}
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-center-center padding-v-1 padding-h-1x25'>
          <button
            type='submit'
            className='btn-primary btn-wide'>
            Submit
          </button>
        </div>
        {!errors ? null :
        <hr className='hr margin-h-1x25' />}
        <FormErrors errors={errors} />
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

class _Transaction extends u.ViewComponent {
  render({props}) {
    const {categoriesById, accountsById, payeesById, tx, setTransaction, setDialog} = props
    const type = defineTransactionType(tx)
    return (
      <m.FakeButton
        type='div'
        onClick={() => {
          setTransaction(tx)
          setDialog(FormDialog, {
            form: TransactionForm,
            title: 'Edit transaction',
            onClose: setTransaction,
          })
        }}
        className='row-start-center gaps-h-1 padding-h-1 list-item text-left theme-light-menu-busy'>
        <div className='row-start-center padding-v-1'>
          {type === OUTCOME ? (
          <div className='relative width-2x5 square circle bg-warning-100'>
            <div className='row-center-center abs-center fg-white font-large'>
              {tx.categoryId
                ? categoriesById[tx.categoryId].title[0]
                : <s.Minus />}
            </div>
          </div>
          ) : type === INCOME ? (
          <div className='relative width-2x5 square circle bg-success'>
            <div className='row-center-center abs-center fg-white font-large'>
              {tx.categoryId
                ? categoriesById[tx.categoryId].title[0]
                : <s.Plus />}
            </div>
          </div>
          ) : (
          <div className='relative width-2x5 square circle bg-accent'>
            <div className='row-center-center abs-center fg-white font-large'>
              <s.ChevronsRight />
            </div>
          </div>)}
        </div>
        <div className='flex-1 col-start-stretch'>
          <div className='row-between-center gaps-h-1 padding-v-1'>
            <div className='col-start-stretch'>
              {type === OUTCOME ?
              <span className='row-start-center gaps-h-0x25'>
                {!tx.categoryId ? null :
                <span>{categoriesById[tx.categoryId].title}</span>}
                {!tx.categoryId || !tx.payeeId ? null :
                <s.ArrowRight className='font-midlarge' />}
                {!tx.payeeId ? null :
                <span>{payeesById[tx.payeeId].title}</span>}
              </span>
              : type === INCOME ?
              <span className='row-start-center gaps-h-0x25'>
                {!tx.payeeId ? null :
                <span>{payeesById[tx.payeeId].title}</span>}
                {!tx.payeeId || !tx.categoryId ? null :
                <s.ArrowRight className='font-midlarge' />}
                {!tx.categoryId ? null :
                <span>{categoriesById[tx.categoryId].title}</span>}
              </span>
              : null}
              <span className='font-midsmall fg-black-50'>
                {tx.date} {tx.date && tx.comment ? '·' : ''} {tx.comment}
              </span>
            </div>
            <div className='row-end-center gaps-h-1'>
              {!f.includes([OUTCOME, TRANSFER], type) ? null :
              <div className='col-start-stretch text-right wspace-nowrap'>
                <span>{`-${tx.outcomeAmount}`}</span>
                <span className='font-midsmall fg-black-50'>
                  {accountsById[tx.outcomeAccountId].title}
                </span>
              </div>}
              {!f.includes([INCOME, TRANSFER], type) ? null :
              <div className='col-start-stretch text-right wspace-nowrap'>
                <span className='fg-success'>{`+${tx.incomeAmount}`}</span>
                <span className='font-midsmall fg-black-50'>
                  {accountsById[tx.incomeAccountId].title}
                </span>
              </div>}
            </div>
          </div>
          <hr className='hr hide-in-list-last-child' />
        </div>
      </m.FakeButton>
    )
  }
}

const Transaction = connect(state => ({
  categoriesById: state.net.categoriesById,
  accountsById: state.net.accountsById,
  payeesById: state.net.payeesById,
}), dispatch => ({
  setTransaction: transaction => dispatch(a.receiveTransaction(transaction)),
  setDialog: (dialog, props) => dispatch(a.setDialog(dialog, props)),
}))(_Transaction)

class _TransactionsList extends u.ViewComponent {
  render({
    props: {transactions},
  }) {
    return (
      <div className='col-start-stretch'>
        {f.map(transactions, tx => (
          <Transaction key={tx.id} tx={tx} />
        ))}
      </div>
    )
  }
}

const TransactionsList = connect(state => ({
  transactions: state.net.transactions,
}))(_TransactionsList)

function defineTransactionType(transaction) {
  const {outcomeAccountId, incomeAccountId} = transaction

  return outcomeAccountId && !incomeAccountId
    ? OUTCOME
    : !outcomeAccountId && incomeAccountId
    ? INCOME
    : outcomeAccountId && incomeAccountId
    ? TRANSFER
    : OUTCOME
}

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
  constructor({onUpdate}) {
    super(...arguments)
    this.onChange = ({target: {value}}) => {
      if (!onUpdate) return
      f.validate(onUpdate, f.isFunction)
      onUpdate(value)
    }
  }

  render({
    onChange,
    props: {label, name, type, value, defaultValue, readOnly, disabled},
  }) {
    return (
      <G7FormLine>
        <FormLabel className='input-height' htmlFor={name}>
          {label}
        </FormLabel>
        <input
          id={name}
          name={name}
          type={type || 'text'}
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
    const {props: {value, defaultValue, onUpdate}} = this

    this.onYearInput = ({target: {value: year}}) => {
      year = u.parseNum(year)
      const month = this.mayBeMonth(year, this.state.month)
      const days  = u.daysInMonthList(year, month)
      const day   = this.mayBeDay(days, this.state.day)
      this.setState({year, month, day, days})
      this.onDateInput(year, month, day)
    }

    this.onMonthInput = ({target: {value: month}}) => {
      month = u.parseNum(month)
      const year = this.state.year
      const days = u.daysInMonthList(year, month)
      const day  = this.mayBeDay(days, this.state.day)
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
      if (!onUpdate) return
      f.validate(onUpdate, f.isFunction)

      if (year != null && month != null && day != null) {
        const date = u.addBrowserOffset(new Date(year, month, day))
        onUpdate(date)
      }
      else {
        onUpdate(undefined)
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
  constructor({onUpdate}) {
    super(...arguments)
    this.onChange = ({target: {value}}) => {
      if (!onUpdate) return
      f.validate(onUpdate, f.isFunction)
      onUpdate(value)
    }
  }

  render({
    onChange,
    props: {label, name, value, defaultValue, readOnly, disabled, children},
  }) {
    return (
      <G7FormLine>
        <FormLabel className='input-height' htmlFor={name}>
          {label}
        </FormLabel>
        <select
          id={`${name}_${value}`}
          name={name}
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

class FormErrors extends u.ViewComponent {
  render({props: {errors}}) {
    return !errors ? null : (
      <div className='col-start-center padding-v-1 fg-accent font-midsmall'>
        {f.map(errors, ({text}, index) => (
          <p key={`error-${index}`}>{text}</p>
        ))}
      </div>
    )
  }
}

class Radio extends u.ViewComponent {
  constructor({onUpdate}) {
    super(...arguments)
    this.onChange = ({target: {value}}) => {
      if (!onUpdate) return
      f.validate(onUpdate, f.isFunction)
      onUpdate(value)
    }
  }

  render({
    onChange,
    props: {name, value, readOnly, disabled, checked, defaultChecked},
  }) {
    return (
      <label className='radio'>
        <input
          id={`${name}_${value}`}
          name={name}
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
