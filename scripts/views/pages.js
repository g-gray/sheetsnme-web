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
          </div>
          <UserMenu />
        </header>
      )
    }

    return (
      <header className='row-between-stretch bg-primary-100 navbar-height shadow-dept-1'>
        <Link to='/' className='row-center-center gaps-h-0x75 padding-h-1 decorate-dark-menu-item'>
          <Logo />
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
            className='dropdown-position z-index-tooltip'
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
            <div className='row-start-center padding-h-1 bg-primary-100 navbar-height shadow-dept-1'>
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
    props: {pending},
  }) {
    const isMobile = u.isMobile(context)
    const disabled = f.size(pending)

    return (
      <form className='col-start-stretch' onSubmit={this.onSubmit}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <FormTextElement
            name='title'
            label='Name'
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'title'])} />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-center-center padding-v-1 padding-h-1x25'>
          <button
            type='submit'
            className='btn-primary btn-wide'
            disabled={disabled}>
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
  pending: state.net.pending,
}))(_CategoryForm)

class _CategoriesList extends u.ViewComponent {
  render({
    props: {categories, pending, dispatch},
  }) {
    return f.size(pending) || !f.size(categories) ? (
      <div className='col-start-stretch'>
        {f.map(new Array(3), (__, index) => (
          <EntityPlaceholder key={`placeholder-${index}`} />
        ))}
      </div>
    ) : (
      <div className='col-start-stretch'>
        {f.map(categories, cat => (
          <EntityItem
            key={cat.id}
            onOpen={() => {
              dispatch(a.receiveCategory(cat))
              dispatch(a.setDialog(FormDialog, {
                form: CategoryForm,
                title: 'Edit category',
                onClose: () => dispatch(a.receiveCategory()),
              }))
            }}
            onDelete={() => {
              dispatch(a.setDialog(ConfirmDialog, {
                question: 'Delete this category?',
                onConfirm: () => {
                  dispatch(a.deleteCategory(cat.id))
                    .then(() => dispatch(a.notify({text: 'Category deleted'})))
                    .then(() => dispatch(a.fetchCategories()))
                },
              }))
            }}>
            {cat.title}
          </EntityItem>
        ))}
      </div>
    )
  }
}

const CategoriesList = connect(state => ({
  categories: state.net.categories,
  pending: state.net.pending,
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
    props: {pending},
  }) {
    const isMobile = u.isMobile(context)
    const disabled = f.size(pending)

    return (
      <form className='col-start-stretch' onSubmit={this.onSubmit}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <FormTextElement
            name='title'
            label='Name'
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'title'])} />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-center-center padding-v-1 padding-h-1x25'>
          <button
            type='submit'
            className='btn-primary btn-wide'
            disabled={disabled}>
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
  pending: state.net.pending,
}))(_AccountForm)

class _AccountsList extends u.ViewComponent {
  render({
    props: {accounts, pending, dispatch},
  }) {
    return f.size(pending) || !f.size(accounts) ? (
      <div className='col-start-stretch'>
        {f.map(new Array(3), (__, index) => (
          <EntityPlaceholder key={`placeholder-${index}`} />
        ))}
      </div>
    ) : (
      <div className='col-start-stretch'>
        {f.map(accounts, acc => (
          <EntityItem
            key={acc.id}
            onOpen={() => {
              dispatch(a.receiveAccount(acc))
              dispatch(a.setDialog(FormDialog, {
                form: AccountForm,
                title: 'Edit account',
                onClose: () => dispatch(a.receiveAccount()),
              }))
            }}
            onDelete={() => {
              dispatch(a.setDialog(ConfirmDialog, {
                question: 'Delete this account?',
                onConfirm: () => {
                  dispatch(a.deleteAccount(acc.id))
                    .then(() => dispatch(a.notify({text: 'Account deleted'})))
                    .then(() => dispatch(a.fetchAccounts()))
                },
              }))
            }}>
            <div className='flex-1 row-between-center gaps-h-1'>
              <span>{acc.title}</span>
              <span className='fg-black-50'>{acc.balance}</span>
            </div>
          </EntityItem>
        ))}
      </div>
    )
  }
}

const AccountsList = connect(state => ({
  accounts: state.net.accounts,
  pending: state.net.pending,
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
    props: {pending},
  }) {
    const isMobile = u.isMobile(context)
    const disabled = f.size(pending)

    return (
      <form className='col-start-stretch' onSubmit={this.onSubmit}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <FormTextElement
            name='title'
            label='Name'
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'title'])} />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-center-center padding-v-1 padding-h-1x25'>
          <button
            type='submit'
            className='btn-primary btn-wide'
            disabled={disabled}>
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
  pending: state.net.pending,
}))(_PayeeForm)

class _PayeesList extends u.ViewComponent {
  render({
    props: {payees, pending, dispatch},
  }) {
    return f.size(pending) || !f.size(payees) ? (
      <div className='col-start-stretch'>
        {f.map(new Array(3), (__, index) => (
          <EntityPlaceholder key={`placeholder-${index}`} />
        ))}
      </div>
    ) : (
      <div className='col-start-stretch'>
        {f.map(payees, payee => (
          <EntityItem
            key={payee.id}
            onOpen={() => {
              dispatch(a.receivePayee(payee))
              dispatch(a.setDialog(FormDialog, {
                form: PayeeForm,
                title: 'Edit payee',
                onClose: () => dispatch(a.receivePayee()),
              }))
            }}
            onDelete={() => {
              dispatch(a.setDialog(ConfirmDialog, {
                question: 'Delete this payee?',
                onConfirm: () => {
                  dispatch(a.deletePayee(payee.id))
                    .then(() => dispatch(a.notify({text: 'Payee deleted'})))
                    .then(() => dispatch(a.fetchPayees()))
                },
              }))
            }}>
            {payee.title}
          </EntityItem>
        ))}
      </div>
    )
  }
}

const PayeesList = connect(state => ({
  payees: state.net.payees,
  pending: state.net.pending,
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



const OUTCOME  = 'OUTCOME'
const INCOME   = 'INCOME'
const TRANSFER = 'TRANSFER'
const LOAN     = 'LOAN'
const BORROW   = 'BORROW'

class _TransactionForm extends u.ViewComponent {
  constructor() {
    super(...arguments)

    this.state = {formValues: this.props.transaction || {type: OUTCOME, date: u.formatDate(new Date())}}

    this.onSubmit = event => {
      u.preventDefault(event)

      this.setState({errors: null})

      const {dispatch} = this.props
      const {formValues} = this.state
      const data = {...formValues, date: u.formatDate(formValues.date)}

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
      const {formValues} = this.state
      const {type, outcomeAccountId, outcomeAmount, incomeAccountId, incomeAmount} = formValues

      if (f.includes([OUTCOME, LOAN], type) && f.includes([INCOME, BORROW], value)) {
        this.setState({
          formValues: {
            ...formValues,
            type: value,
            incomeAccountId : outcomeAccountId,
            incomeAmount    : outcomeAmount,
            outcomeAccountId: incomeAccountId,
            outcomeAmount   : incomeAmount,
          },
        })
        return
      }

      if (f.includes([INCOME, BORROW], type) && f.includes([OUTCOME, LOAN], value)) {
        this.setState({
          formValues: {
            ...formValues,
            type: value,
            outcomeAccountId: incomeAccountId,
            outcomeAmount   : incomeAmount,
            incomeAccountId : outcomeAccountId,
            incomeAmount    : outcomeAmount,
          },
        })
        return
      }

      if (f.includes([OUTCOME, LOAN], type) && value === TRANSFER) {
        this.setState({
          formValues: {
            ...formValues,
            type: value,
            incomeAmount: outcomeAmount,
          },
        })
        return
      }

      if (f.includes([INCOME, BORROW], type) && value === TRANSFER) {
        this.setState({
          formValues: {
            ...formValues,
            type: value,
            outcomeAmount: incomeAmount,
          },
        })
        return
      }

      this.setState({formValues: {
        ...formValues,
        type: value,
      }})
    }
  }

  render({
    context,
    state: {formValues: {type}, errors},
    props: {categories, accounts, payees, pending},
  }) {
    const isMobile = u.isMobile(context)
    const disabled = f.size(pending)

    return (
      <form className='col-start-stretch' onSubmit={this.onSubmit}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <FormDateElement
            name='date'
            label='Date'
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'date'])} />
          <G7FormLine>
            <FormLabel>
              Type
            </FormLabel>
            <div className='col-start-stretch gaps-v-0x5'>
              <div className={isMobile ? 'col-start-stretch gaps-v-0x5' : 'row-start-center gaps-h-1'}>
                <label className='row-start-center gaps-h-0x5'>
                  <Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], OUTCOME)}
                    onUpdate={this.onTypeUpdated} />
                  <span>Outcome</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], INCOME)}
                    onUpdate={this.onTypeUpdated} />
                  <span>Income</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], TRANSFER)}
                    onUpdate={this.onTypeUpdated} />
                  <span>Transfer</span>
                </label>
              </div>
              <div className={isMobile ? 'col-start-stretch gaps-v-0x5' : 'row-start-center gaps-h-1'}>
                <label className='row-start-center gaps-h-0x5'>
                  <Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], LOAN)}
                    onUpdate={this.onTypeUpdated} />
                  <span>I loaned</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], BORROW)}
                    onUpdate={this.onTypeUpdated} />
                  <span>I borrowed</span>
                </label>
              </div>
            </div>
          </G7FormLine>

          {!f.includes([OUTCOME, LOAN, TRANSFER], type) ? null :
          <Fragment>
            <FormTextElement
              name='outcomeAmount'
              label='Amount'
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'outcomeAmount'], u.parseNum)} />
            <FormSelectElement
              name='outcomeAccountId'
              label='Account'
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'outcomeAccountId'])}>
              <option value='' />
              {f.map(accounts, ({id, title}) => (
                <option value={id} key={`outcome-account-${id}`}>
                  {title}
                </option>
              ))}
            </FormSelectElement>
          </Fragment>}

          {!f.includes([INCOME, BORROW, TRANSFER], type) ? null :
          <Fragment>
            <FormTextElement
              name='incomeAmount'
              label='Amount'
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'incomeAmount'], u.parseNum)} />
            <FormSelectElement
              name='incomeAccountId'
              label='Account'
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'incomeAccountId'])}>
              <option value='' />
              {f.map(accounts, ({id, title}) => (
                <option value={id} key={`income-account-${id}`}>
                  {title}
                </option>
              ))}
            </FormSelectElement>
          </Fragment>}

          {!f.includes([OUTCOME, INCOME], type) ? null :
          <FormSelectElement
            name='categoryId'
            label='Category'
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'categoryId'])}>
            <option value='' />
            {f.map(categories, ({id, title}) => (
              <option value={id} key={`category-${id}`}>
                {title}
              </option>
            ))}
          </FormSelectElement>}

          {!f.includes([OUTCOME, INCOME, LOAN, BORROW], type) ? null :
          <FormSelectElement
            name='payeeId'
            label='Payee'
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'payeeId'])}>
            <option value='' />
            {f.map(payees, ({id, title}) => (
              <option value={id} key={`payee-${id}`}>
                {title}
              </option>
            ))}
          </FormSelectElement>}

          <FormTextElement
            name='comment'
            label='Comment'
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'comment'])} />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-center-center padding-v-1 padding-h-1x25'>
          <button
            type='submit'
            className='btn-primary btn-wide'
            disabled={disabled}>
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
  pending: state.net.pending,
}))(_TransactionForm)

class TransactionPlaceholder extends u.ViewComponent {
  render({
    context,
  }) {
    const isMobile = u.isMobile(context)

    return (
      <div className='row-start-center gaps-h-1 padding-h-1 list-item'>
        <div className='row-start-center padding-v-1'>
          <div className='relative width-2x5 square circle bg-primary-275' />
        </div>
        <div className='flex-1 col-start-stretch transaction-line-height'>
          <div className='col-start-stretch gaps-v-0x25 padding-v-1'>
            <div className='row-between-center gaps-h-1 font-midsmall fg-black-50'>
              <Placeholder style={{width: '4em'}} />
              <Placeholder style={{width: '6em'}} />
            </div>
            <div className='row-between-start gaps-h-1'>
              <Placeholder style={{width: '8em'}} />
              <Placeholder style={{width: '3em'}} />
            </div>
          </div>
          <hr className='hr hide-in-list-last-child' />
        </div>
        {isMobile ? null :
        <div className='row-center-center padding-v-1'>
          <div className='width-2x5 square' disabled />
        </div>}
      </div>
    )
  }
}

class EntityPlaceholder extends u.ViewComponent {
  render() {
    return (
      <div className='row-start-stretch gaps-h-1 padding-h-1'>
        <div className='relative width-2x5 square'>
          <div className='row-center-center abs-center'>
            <div className='width-1x5 square circle bg-primary-275' />
          </div>
        </div>
        <div className='flex-1 col-start-stretch'>
          <div className='flex-1 row-start-center padding-v-1'>
            <Placeholder style={{width: '8em'}} />
          </div>
        </div>
      </div>
    )
  }
}

class EntityItem extends u.ViewComponent {
  constructor({onOpen}) {
    super(...arguments)
    this.actions = React.createRef()

    this.onClick = event => {
      if (!onOpen) return
      f.validate(onOpen, f.isFunction)

      const actions = u.findDomNode(this.actions.current)
      if (u.isAncestorOf(actions, event.target)) return

      onOpen()
    }
  }

  render({
    context,
    props: {children, onDelete},
  }) {
    const isMobile = u.isMobile(context)

    return (
      <m.FakeButton
        type='div'
        onClick={this.onClick}
        className='row-start-stretch gaps-h-1 padding-h-1 text-left theme-light-menu-busy trigger'>
        <div className='relative width-2x5 square'>
          <div className='row-center-center abs-center'>
            <s.Tag className='font-large fg-primary-100' />
          </div>
        </div>
        <div className='flex-1 col-start-stretch'>
          <div className='flex-1 row-between-center padding-v-1'>
            {children}
          </div>
        </div>
        <div className='row-center-center' ref={this.actions}>
          <m.FakeButton
            className={`row-center-center decorate-light-menu-item ${!isMobile ? 'show-on-trigger-hover' : ''}`}
            onClick={onDelete}>
            <s.Trash2 className='font-large' />
          </m.FakeButton>
        </div>
      </m.FakeButton>
    )
  }
}

class Placeholder extends u.ViewComponent {
  render({props: {style, className: cls}}) {
    return (
      <span className={`inline-block ${cls || ''}`}>
        <span
          className='inline-block valign-middle bg-primary-275 rounded-50p'
          style={{width: '3em', height: '1em', ...style}} />
      </span>
    )
  }
}

class _Transaction extends u.ViewComponent {
  constructor() {
    super(...arguments)
    this.actions = React.createRef()

    this.onDelete = id => {
      const {dispatch} = this.props
      dispatch(a.deleteTransaction(id))
        .then(() => dispatch(a.notify({text: 'Transaction deleted'})))
        .then(() => dispatch(a.fetchTransactions()))
    }
  }

  render({
    context,
    props: {tx, dispatch},
  }) {
    const isMobile = u.isMobile(context)

    return (
      <m.FakeButton
        type='div'
        onClick={event => {
          const actions = u.findDomNode(this.actions.current)
          if (u.isAncestorOf(actions, event.target)) return

          dispatch(a.receiveTransaction(tx))
          dispatch(a.setDialog(FormDialog, {
            form: TransactionForm,
            title: 'Edit transaction',
            onClose: () => dispatch(a.receiveTransaction()),
          }))
        }}
        className='row-start-start gaps-h-1 padding-h-1 list-item trigger text-left theme-light-menu-busy'>
        <div className='row-start-center padding-v-1'>
          <TransactionIcon transaction={tx} />
        </div>
        <div className='flex-1 col-start-stretch transaction-line-height'>
          <div className='col-start-stretch gaps-v-0x25 padding-v-1'>
            <div className='row-between-center gaps-h-1 font-midsmall fg-black-50'>
              <TransactionOrigin transaction={tx} />
              <TransactionAccount transaction={tx} />
            </div>
            <div className='row-between-start gaps-h-1'>
              <TransactionMeta transaction={tx} />
              <TransactionAmount transaction={tx} />
            </div>
          </div>
          <hr className='hr hide-in-list-last-child' />
        </div>
        {isMobile ? null :
        <div className='row-center-center padding-v-1' ref={this.actions}>
          <m.FakeButton
            className='relative width-2x5 square circle show-on-trigger-hover bg-primary-125'
            onClick={() => {
              dispatch(a.setDialog(ConfirmDialog, {
                question: 'Delete this transaction?',
                onConfirm: () => this.onDelete(tx.id),
              }))
            }}>
            <div className='row-center-center abs-center fg-white font-large'>
              <s.Trash2 />
            </div>
          </m.FakeButton>
        </div>}
      </m.FakeButton>
    )
  }
}

const Transaction = connect()(_Transaction)

class TransactionIcon extends u.ViewComponent {
  render({
    props: {transaction: tx},
  }) {
    return (
      <div className='row-start-center'>
        {f.includes([OUTCOME, LOAN], tx.type) ? (
        <div className='relative width-2x5 square circle bg-warning-100'>
          <div className='row-center-center abs-center fg-white font-large'>
            <s.Minus />
          </div>
        </div>
        ) : f.includes([INCOME, BORROW], tx.type) ? (
        <div className='relative width-2x5 square circle bg-success'>
          <div className='row-center-center abs-center fg-white font-large'>
            <s.Plus />
          </div>
        </div>
        ) : (
        <div className='relative width-2x5 square circle bg-black-75'>
          <div className='row-center-center abs-center fg-white font-large'>
            <s.Repeat />
          </div>
        </div>
        )}
      </div>
    )
  }
}

class TransactionAmount extends u.ViewComponent {
  render({
    props: {transaction: tx},
  }) {
    return (
      <span className='wspace-nowrap'>
        { tx.type === BORROW
        ? <span className='fg-warning-100'>{`+${tx.outcomeAmount}`}</span>
        : tx.type === LOAN
        ? <span className='fg-warning-100'>{`-${tx.incomeAmount}`}</span>
        : tx.type === INCOME
        ? <span className='fg-success'>{`+${tx.incomeAmount}`}</span>
        : tx.type === OUTCOME
        ? <span>{`-${tx.outcomeAmount}`}</span>
        : <span>{tx.outcomeAmount || tx.incomeAmount}</span>}
      </span>
    )
  }
}

class _TransactionAccount extends u.ViewComponent {
  render({
    props: {transaction: tx, accountsById},
  }) {
    const outcomeAccount = f.scan(accountsById, tx.outcomeAccountId, 'title')
    const incomeAccount  = f.scan(accountsById, tx.incomeAccountId, 'title')

    return (
      <span className='row-start-center gaps-h-0x25 wspace-nowrap'>
        {!outcomeAccount ? null :
        <span>{outcomeAccount}</span>}
        {!outcomeAccount || !incomeAccount ? null :
        <s.ArrowRight />}
        {!incomeAccount ? null :
        <span>{incomeAccount}</span>}
      </span>
    )
  }
}

const TransactionAccount = connect(state => ({
  accountsById: state.net.accountsById,
}))(_TransactionAccount)

class _TransactionOrigin extends u.ViewComponent {
  render({
    props: {transaction: tx, categoriesById, payeesById},
  }) {
    return (
      <span className='flex-1 width-0 text-ellipsis'>
        {f.scan(payeesById, tx.payeeId, 'title') ||
         f.scan(categoriesById, tx.categoryId, 'title') || 'Without category category category'}
      </span>
    )
  }
}

const TransactionOrigin = connect(state => ({
  categoriesById: state.net.categoriesById,
  payeesById: state.net.payeesById,
}))(_TransactionOrigin)

class _TransactionsList extends u.ViewComponent {
  render({
    props: {transactions, pending},
  }) {
    return f.size(pending) || !f.size(transactions) ? (
      <div className='col-start-stretch'>
        {f.map(new Array(3), (__, index) => (
          <TransactionPlaceholder key={`placeholder-${index}`} />
        ))}
      </div>
    ) : (
      <div className='col-start-stretch'>
        {f.map(transactions, tx => (
          <Transaction key={tx.id} tx={tx} />
        ))}
      </div>
    )
  }
}

class TransactionMeta extends u.ViewComponent {
  render({
    context,
    props: {transaction: tx},
  }) {
    const isMobile = u.isMobile(context)

    return (
      <span>
        {tx.date} {!isMobile && tx.date && tx.comment ? '·' : ''} {!isMobile && tx.comment}
      </span>
    )
  }
}

const TransactionsList = connect(state => ({
  transactions: state.net.transactions,
  pending: state.net.pending,
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
          <s.Plus className='abs-center font-giant fg-white' />
        </span>
      </m.FakeButton>
    )
  }
}

class _ActionsMenu extends u.ViewComponent {
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
    props: {children},
    state: {expanded},
  }) {
    return !children ? null : (
      <div className='relative row-start-stretch'>
        <m.FakeButton
          onClick={this.toggle}
          className='relative row-start-center decorate-light-menu-item z-index-2'
          aria-expanded={expanded}>
          <s.MoreVertical className='font-large' />
        </m.FakeButton>
        {!expanded ? null :
        <m.Closer root={this} close={this.close}>
          <div
            className='dropdown-position z-index-1'
            onClick={this.close}>
            <div className='dropdown dropdown-padding col-start-stretch' style={{minWidth: '11rem'}}>
              {children}
            </div>
          </div>
        </m.Closer>}
      </div>
    )
  }
}

class _ConfirmDialog extends u.ViewComponent {
  constructor() {
    super(...arguments)

    this.close = () => {
      this.props.setDialog()
      if (this.props.onClose) this.props.onClose()
    }

    this.confirm = () => {
      this.props.setDialog()
      if (this.props.onConfirm) this.props.onConfirm()
    }
  }

  render({
    props: {question, cancelText, confirmText},
  }) {
    return (
      <m.Dialog onEscape={this.close}>
        <m.DialogOverlay className='bg-overlay-dark' />
        <m.DialogCentered onClick={this.close}>
          <div
            className='col-start-stretch gaps-v-1 padding-v-1 rounded bg-white shadow-dept-3'
            style={{minWidth: '11rem'}}>
            <p className='padding-h-1x25 font-midlarge weight-medium'>
              {question}
            </p>
            <div className='row-center-center gaps-h-1'>
              <m.FakeButton className='btn-secondary' onClick={this.close}>
                {cancelText || 'Cancel'}
              </m.FakeButton>
              <m.FakeButton className='btn-primary' onClick={this.confirm}>
                {confirmText || 'Ok'}
              </m.FakeButton>
            </div>
          </div>
        </m.DialogCentered>
      </m.Dialog>
    )
  }
}

const ConfirmDialog = connect(null, dispatch => ({
  setDialog: dialog => dispatch(a.setDialog(dialog)),
}))(_ConfirmDialog)

export class Page404 extends u.ViewComponent {
  render({context}) {
    const content = (
      <Fragment>
        <div className='col-start-center gaps-v-0x5'>
          <h2 style={{lineHeight: '1', fontSize: '3em'}}>404</h2>
          <p>Page Not Found</p>
        </div>
        <p className='row-center-center'>
          <Link to='/' className='btn-primary'>Dashboard</Link>
        </p>
      </Fragment>
    )

    if (u.isMobile(context)) {
      return (
        <MobilePageLayout>
          <div className='col-start-stretch gaps-v-1 padding-v-3'>
            {content}
          </div>
        </MobilePageLayout>
      )
    }

    return (
      <PageLayout className='relative col-start-center padding-r-1x25'>
        <div className='limit-content-width col-start-center gaps-v-1 padding-v-3'>
          {content}
        </div>
      </PageLayout>
    )
  }
}
