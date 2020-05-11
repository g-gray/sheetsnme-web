import * as t from '../types'

import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {NavLink, Link, withRouter} from 'react-router-dom'
import ReactPaginate from 'react-paginate'

// @ts-ignore
import * as fpx from 'fpx'

import * as a from '../actions'
import * as u from '../utils'

import * as m from './misc'
import * as s from './svg'
import * as f from './forms'
import * as d from '../dialogs'
import * as n from '../notifications'
import * as g from '../geometry'

import * as i18n from '../i18n'

/**
 * Layouts
 */

class PageLayout extends m.ViewComponent {
  render() {
    const {
      props: {className: cls, style, children},
    } = this

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
        <div className='fix-b-l z-index-tooltip width-100p row-start-center margin-0x5'>
          <n.Notifications />
        </div>
        <d.GlobalDialog />
      </div>
    )
  }
}

class _MobilePageLayout extends m.ViewComponent {
  render() {
    const {
      props: {className: cls, style, children, action, dialogs},
    } = this

    return (
      <div className='relative col-start-stretch stretch-to-viewport-v padding-b-5'>
        <Navbar />
        <div
          className={`flex-1 ${cls || ''}`}
          style={style}
          children={children} />
        <div className='fix-b-l z-index-tooltip width-100p col-start-stretch gaps-v-0x5 padding-0x5'>
          <n.Notifications />
          {!action || fpx.size(dialogs) ? null :
          <div className='row-end-center padding-0x5'>
            {action}
          </div>}
        </div>
        <d.GlobalDialog />
      </div>
    )
  }
}

const MobilePageLayout = connect(state => ({
  dialogs: state.dom.dialogs,
}))(_MobilePageLayout)



/**
 * Navigation
 */

class Logo extends m.ViewComponent {
  render() {
    return (
      <s.Logo className='fg-surface' style={{width: '2rem', height: '2rem'}} />
    )
  }
}

class _Navbar extends m.ViewComponent {
  constructor({dispatch}) {
    super(...arguments)

    const {context} = this

    this.open = () => {
      dispatch(a.addDialog(MobileMenu))
    }

    this.nextLang = () => {
      dispatch(a.nextLang())
    }
  }

  render() {
    const {
      context,
      open, nextLang,
    } = this

    if (g.isMobile(context)) {
      return (
        <header className='row-between-stretch bg-primary navbar-height shadow-dept-1'>
          <div className='row-start-center gaps-h-0x75 padding-h-1'>
            <m.FakeButton
              className='row-center-center padding-0x5 circle decorate-dark-menu-item'
              onClick={open}>
              <s.Menu
                style={{fontSize: '1.5rem'}} />
            </m.FakeButton>
          </div>
          <div className='row-start-stretch relative z-index-1'>
            <m.FakeButton
              onClick={nextLang}
              className='relative row-start-center gaps-h-0x75 padding-h-1 decorate-dark-menu-item'>
              {i18n.xln(context, i18n.LANG)}
            </m.FakeButton>
            <UserMenu />
          </div>
        </header>
      )
    }

    return (
      <header className='row-between-stretch bg-primary navbar-height shadow-dept-1'>
        <Link to='/' className='row-center-center gaps-h-0x75 padding-h-1 decorate-dark-menu-item'>
          <Logo />
        </Link>
        <div className='row-start-stretch relative z-index-1'>
          <m.FakeButton
            onClick={nextLang}
            className='relative row-start-center gaps-h-0x75 padding-h-1 decorate-dark-menu-item'>
            {i18n.xln(context, i18n.LANG)}
          </m.FakeButton>
          <UserMenu />
        </div>
      </header>
    )
  }
}

const Navbar = connect()(_Navbar)

type UserMenuStateProps = {
  user: t.UserRes,
}

type UserMenuProps = UserMenuStateProps

type UserMenuState = {
  expanded: boolean,
}

class _UserMenu extends m.ViewComponent<UserMenuProps, UserMenuState> {
  state = {expanded: false}

  close = () => {
    this.setState({expanded: false})
  }

  toggle = () => {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const {
      context,
      props: {user},
      state: {expanded},
      close, toggle,
    } = this

    const {firstName, lastName, pictureUrl, email} = user

    return fpx.isEmpty(user) ? null : (
      <div className='relative row-start-stretch'>
        <m.FakeButton
          onClick={toggle}
          className='relative row-start-center gaps-h-0x75 padding-h-1 decorate-dark-menu-item z-index-2'
          aria-expanded={expanded}>
          <m.CircleUserPic
            url={pictureUrl}
            size='2' />
        </m.FakeButton>
        {!expanded ? null :
        <m.Closer root={this} close={close}>
          <div
            className='dropdown-position z-index-tooltip'
            onClick={close}>
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
                      {i18n.xln(context, i18n.LOGOUT)}
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

const UserMenu = connect<UserMenuStateProps, {}, {}, t.AppState>(state => ({
  user: state.net.user,
}))(_UserMenu)

class _MobileMenu extends m.ViewComponent {
  constructor({dispatch}) {
    super(...arguments)

    this.close = () => {
      dispatch(a.removeDialog())
    }
  }

  render() {
    const {close} = this

    return (
      <d.Dialog onEscape={close}>
        <d.DialogScrollable className='row-start-stretch bg-overlay fade-in-fast' onClick={close}>
          <div className='relative col-start-stretch gaps-v-0x5 bg-surface slide-in-left-fast' onClick={close}>
            <div className='row-start-center padding-h-1 bg-primary navbar-height shadow-dept-1'>
              <Logo />
            </div>
            <Drawer />
          </div>
        </d.DialogScrollable>
      </d.Dialog>
    )
  }
}

const MobileMenu = connect()(_MobileMenu)

class Drawer extends m.ViewComponent {
  render() {
    const {context} = this

    return (
      <aside className='col-start-stretch gaps-v-1 padding-v-1' style={{width: '16rem'}}>
        <div className='col-start-stretch padding-h-0x5'>
          <NavLink
            to='/'
            exact
            className='drawer-link decorate-drawer-link'>
            <s.BarChart className='font-large theme-drawer-icon' />
            <span>{i18n.xln(context, i18n.TRANSACTIONS)}</span>
          </NavLink>
        </div>
        <hr className='hr' />
        <div className='col-start-stretch padding-h-0x5'>
          <NavLink
            to='/categories'
            exact
            className='drawer-link decorate-drawer-link'>
            <s.Tag className='font-large theme-drawer-icon' />
            <span>{i18n.xln(context, i18n.CATEGORIES)}</span>
          </NavLink>
          <NavLink
            to='/accounts'
            exact
            className='drawer-link decorate-drawer-link'>
            <s.CreditCard className='font-large theme-drawer-icon' />
            <span>{i18n.xln(context, i18n.ACCOUNTS)}</span>
          </NavLink>
          <NavLink
            to='/payees'
            exact
            className='drawer-link decorate-drawer-link'>
            <s.Users className='font-large theme-drawer-icon' />
            <span>{i18n.xln(context, i18n.PAYEES)}</span>
          </NavLink>
        </div>
      </aside>
    )
  }
}



/**
 * Entities
 */

export class EntityPlaceholder extends m.ViewComponent {
  render() {
    const {context} = this

    const isMobile = g.isMobile(context)

    return (
      <div className='row-start-stretch gaps-h-1 padding-h-1'>
        <div className='relative width-2x5 square'>
          <div className='row-center-center abs-center'>
            <div className='width-1x5 square circle decorate-placeholder' />
          </div>
        </div>
        <div className='flex-1 col-start-stretch'>
          <div className='flex-1 row-start-center padding-v-1'>
            <Placeholder style={{width: '8em'}} />
          </div>
        </div>
        {isMobile ? null :
        <div className='row-center-center padding-h-0x25'>
          <div className='row-center-center' style={{minHeight: '2.5rem'}}>
            <s.Trash2 className='font-large fg-transparent' />
          </div>
        </div>}
      </div>
    )
  }
}


type EntityItemProps = {
  icon: t.RReactElement,
  onOpen: (event: t.RMouseEvent) => void,
  onDelete: (event: t.RMouseEvent) => void,
}

export class EntityItem extends m.ViewComponent<EntityItemProps> {
  actionsRef = React.createRef<HTMLDivElement>()

  onClick = (event: t.RMouseEvent) => {
    const {actionsRef, props: {onOpen}} = this

    const actionsNode = u.findDomNode(actionsRef.current)
    if (u.isAncestorOf(actionsNode, event.target)) {
      return
    }

    onOpen(event)
  }

  render() {
    const {
      context,
      props: {children, icon, onDelete},
      onClick, actionsRef,
    } = this

    const isMobile = g.isMobile(context)

    return (
      <m.FakeButton
        type='div'
        onClick={onClick}
        className='row-start-stretch gaps-h-1 padding-h-1 text-left theme-drawer-link-busy rounded trigger'>
        <div className='relative width-2x5 square'>
          <div className='row-center-center abs-center'>
            {icon}
          </div>
        </div>
        <div className='flex-1 col-start-stretch'>
          <div className='flex-1 row-between-center padding-v-1'>
            {children}
          </div>
        </div>
        {isMobile ? null :
        <div className='row-center-center padding-h-0x25' ref={actionsRef}>
          <div className='row-center-center' style={{minHeight: '2.5rem'}}>
            <m.FakeButton
              className='row-center-center show-on-trigger-hover decorate-icon-button'
              onClick={onDelete}>
              <s.Trash2 className='font-large' />
            </m.FakeButton>
          </div>
        </div>}
      </m.FakeButton>
    )
  }
}

class Placeholder extends m.ViewComponent {
  render() {
    const {props: {style, className: cls}} = this

    return (
      <span className={`inline-block ${cls || ''}`}>
        <span
          className='inline-block valign-middle decorate-placeholder rounded-50p'
          style={{width: '3em', height: '1em', ...style}} />
      </span>
    )
  }
}



/**
 * Payees
 */

class _PayeesPage extends m.ViewComponent {
  render() {
    const {
      context,
      props: {dispatch},
    } = this

    const action = (
      <Fab
        onClick={() => dispatch(a.addDialog(FormDialog, {
          form: PayeeForm,
          title: i18n.xln(context, i18n.NEW_PAYEE),
        }))} />
    )

    return (
      <ListPage action={action}>
        <PayeesList />
      </ListPage>
    )
  }
}

export const PayeesPage = connect()(_PayeesPage)

class _PayeeForm extends m.ViewComponent {
  constructor({dispatch}) {
    super(...arguments)

    this.state = {formValues: this.props.payee || {}}

    this.onSubmit = event => {
      u.preventDefault(event)

      this.setState({errors: undefined})

      const {context, props, state} = this
      const {formValues} = state

      const promise = formValues.id
        ? dispatch(a.updatePayee(formValues.id, formValues, i18n.xln(context, i18n.UPDATING_PAYEE)))
        : dispatch(a.createPayee(formValues, i18n.xln(context, i18n.CREATING_PAYEE)))

      promise
        .catch(errors => {
          this.setState({errors})
          throw errors
        })
        .then(() => {props.onSubmitSuccess()})
        .then(() => dispatch(a.addNotification(formValues.id
          ? i18n.xln(context, i18n.PAYEE_UPDATED)
          : i18n.xln(context, i18n.PAYEE_CREATED)
        )))
        .then(() => dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES))))
    }

    this.onDelete = event => {
      u.preventDefault(event)

      this.setState({errors: undefined})

      const {context, props, state} = this
      const {formValues} = state

      dispatch(a.addDialog(ConfirmDialog, {
        question: i18n.xln(context, i18n.DELETE_PAYEE),
        onConfirm: () => {
          dispatch(a.deletePayee(formValues.id, i18n.xln(context, i18n.DELETING_PAYEE)))
            .then(() => {props.onSubmitSuccess()})
            .then(() => dispatch(a.addNotification(i18n.xln(context, i18n.PAYEE_DELETED))))
            .then(() => dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES))))
        },
      }))
    }
  }

  render() {
    const {
      context,
      state: {errors, formValues: {id}},
      props: {pending},
      onSubmit, onDelete,
    } = this

    const isMobile = g.isMobile(context)
    const disabled = pending

    return (
      <form className='col-start-stretch' onSubmit={onSubmit}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <f.FormTextElement
            name='title'
            label='Name'
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'title'])} />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-between-stretch padding-v-1 padding-h-1x25'>
          <div className='flex-1 row-start-stretch'>
            {!id ? null :
            <m.FakeButton
              className='btn-transparent'
              onClick={onDelete}
              disabled={disabled}>
              {i18n.xln(context, i18n.DELETE)}
            </m.FakeButton>}
          </div>
          <button
            type='submit'
            className={`btn-primary ${isMobile ? '' : 'btn-wide'}`}
            disabled={disabled}>
            {i18n.xln(context, i18n.SUBMIT)}
          </button>
          <div className='flex-1' />
        </div>
        {!errors ? null :
        <hr className='hr margin-h-1x25' />}
        <f.FormErrors errors={errors} />
      </form>
    )
  }
}

const PayeeForm = connect(state => ({
  pending: !fpx.isEmpty(state.net.pending),
}))(_PayeeForm)

class _PayeesList extends m.ViewComponent {
  constructor({dispatch}) {
    super(...arguments)

    const {context} = this

    this.onOpen = payee => () => {
      dispatch(a.addDialog(FormDialog, {
        form: PayeeForm,
        formProps: {payee},
        title: i18n.xln(context, i18n.EDIT_PAYEE),
      }))
    }

    this.onDelete = payee => () => {
      dispatch(a.addDialog(ConfirmDialog, {
        question: i18n.xln(context, i18n.DELETE_PAYEE),
        onConfirm: () => {
          dispatch(a.deletePayee(payee.id, i18n.xln(context, i18n.DELETING_PAYEE)))
            .then(() => dispatch(a.addNotification(i18n.xln(context, i18n.PAYEE_DELETED))))
            .then(() => dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES))))
        },
      }))
    }
  }

  render() {
    const {
      context,
      props: {payees, pending},
      onOpen, onDelete,
    } = this

    const isMobile = g.isMobile(context)
    return (
      <div className='col-start-stretch gaps-v-2'>
        <div className='col-start-stretch gaps-v-0x25'>
          <div className={`row-end-center ${isMobile ? 'padding-t-0x5 padding-r-1' : 'padding-r-3x5'}`}>
            <span className='fg-on-surface-pale'>{i18n.xln(context, i18n.DEBT)}</span>
          </div>
          {pending || !fpx.size(payees) ? (
            <div className='col-start-stretch'>
              {fpx.map(new Array(fpx.size(payees) || 3), (__, index) => (
                <EntityPlaceholder key={`placeholder-${index}`} />
              ))}
            </div>
          ) : (
            <div className='col-start-stretch'>
              {fpx.map(payees, payee => (
                <EntityItem
                  key={payee.id}
                  icon={<s.Users className='font-large fg-primary' />}
                  onOpen={onOpen(payee)}
                  onDelete={onDelete(payee)}>
                  <div className='flex-1 row-between-center gaps-h-1'>
                    <span>{payee.title}</span>
                    { payee.debt > 0
                    ? <span className='fg-success'>+{payee.debt}</span>
                    : payee.debt < 0
                    ? <span className='fg-error'>{payee.debt}</span>
                    : <span className='fg-on-surface-pale'>{payee.debt}</span>}
                  </div>
                </EntityItem>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
}

const PayeesList = connect(state => {
  const payees  = fpx.sortBy(state.net.payees, payee => !payee.debt ? Infinity : payee.debt)
  const pending = !fpx.isEmpty(state.net.pending)

  return {
    payees,
    pending,
  }
})(_PayeesList)



/**
 * Transactions
 */

class _TransactionsPage extends m.ViewComponent {
  render() {
    const {
      context,
      props: {dispatch},
    } = this

    const action = (
      <Fab
        onClick={() => dispatch(a.addDialog(FormDialog, {
          form: TransactionForm,
          title: i18n.xln(context, i18n.NEW_TRANSACTION),
        }))} />
    )

    return (
      <ListPage action={action}>
        <TransactionsList />
      </ListPage>
    )
  }
}

export const TransactionsPage = connect()(_TransactionsPage)

const OUTCOME  = 'OUTCOME'
const INCOME   = 'INCOME'
const TRANSFER = 'TRANSFER'
const LOAN     = 'LOAN'
const BORROW   = 'BORROW'

class _TransactionForm extends m.ViewComponent {
  constructor({dispatch}) {
    super(...arguments)

    this.state = {formValues: this.props.transaction || {type: OUTCOME, date: u.formatDate(new Date())}}

    this.onSubmit = event => {
      u.preventDefault(event)

      this.setState({errors: undefined})

      const {context, props, state} = this
      const {location, onSubmitSuccess} = props
      const {formValues} = state
      const data = {...formValues, date: u.formatDate(formValues.date)}

      const promise = formValues.id
        ? dispatch(a.updateTransaction(formValues.id, data, i18n.xln(context, i18n.UPDATING_TRANSACTION)))
        : dispatch(a.createTransaction(data, i18n.xln(context, i18n.CREATING_TRANSACTION)))

      promise
        .catch(errors => {
          this.setState({errors})
          throw errors
        })
        .then(() => {onSubmitSuccess()})
        .then(() => dispatch(a.addNotification(formValues.id
            ? i18n.xln(context, i18n.TRANSACTION_UPDATED)
            : i18n.xln(context, i18n.TRANSACTION_CREATED)
        )))
        .then(() => dispatch(a.fetchTransactions(location, i18n.xln(context, i18n.FETCHING_TRANSACTIONS))))
    }

    this.onDelete = event => {
      u.preventDefault(event)

      this.setState({errors: undefined})

      const {context, props, state} = this
      const {location, onSubmitSuccess} = props
      const {formValues} = state

      dispatch(a.addDialog(ConfirmDialog, {
        question: i18n.xln(context, i18n.DELETE_TRANSACTION),
        onConfirm: () => {
          dispatch(a.deleteTransaction(formValues.id, i18n.xln(context, i18n.DELETING_TRANSACTION)))
            .then(() => {onSubmitSuccess()})
            .then(() => dispatch(a.addNotification(i18n.xln(context, i18n.TRANSACTION_DELETED))))
            .then(() => dispatch(a.fetchTransactions(location, i18n.xln(context, i18n.FETCHING_TRANSACTIONS))))
        },
      }))
    }

    this.onTypeUpdated = value => {
      const {formValues} = this.state
      const {type, outcomeAccountId, outcomeAmount, incomeAccountId, incomeAmount} = formValues

      if (fpx.includes([OUTCOME, LOAN], type) && fpx.includes([INCOME, BORROW], value)) {
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

      if (fpx.includes([INCOME, BORROW], type) && fpx.includes([OUTCOME, LOAN], value)) {
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

      if (fpx.includes([OUTCOME, LOAN], type) && value === TRANSFER) {
        this.setState({
          formValues: {
            ...formValues,
            type: value,
            incomeAmount: outcomeAmount,
          },
        })
        return
      }

      if (fpx.includes([INCOME, BORROW], type) && value === TRANSFER) {
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

  render() {
    const {
      context,
      state: {formValues: {type, id}, errors},
      props: {categories, accounts, payees, pending},
      onSubmit, onDelete, onTypeUpdated,
    } = this

    const isMobile = g.isMobile(context)
    const disabled = pending

    return (
      <form className='col-start-stretch' onSubmit={onSubmit}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <f.FormDateElement
            name='date'
            label={i18n.xln(context, i18n.DATE)}
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'date'])} />
          <f.G7FormLine>
            <f.FormLabel>
              Type
            </f.FormLabel>
            <div className='col-start-stretch gaps-v-0x5'>
              <div className={isMobile ? 'col-start-stretch gaps-v-0x5' : 'row-start-center gaps-h-1'}>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], OUTCOME)}
                    onUpdate={onTypeUpdated} />
                  <span>{i18n.xln(context, i18n.OUTCOME)}</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], INCOME)}
                    onUpdate={onTypeUpdated} />
                  <span>{i18n.xln(context, i18n.INCOME)}</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], TRANSFER)}
                    onUpdate={onTypeUpdated} />
                  <span>{i18n.xln(context, i18n.TRANSFER)}</span>
                </label>
              </div>
              <div className={isMobile ? 'col-start-stretch gaps-v-0x5' : 'row-start-center gaps-h-1'}>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], LOAN)}
                    onUpdate={onTypeUpdated} />
                  <span>{i18n.xln(context, i18n.I_LOANED)}</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], BORROW)}
                    onUpdate={onTypeUpdated} />
                  <span>{i18n.xln(context, i18n.I_BORROWED)}</span>
                </label>
              </div>
            </div>
          </f.G7FormLine>

          {!fpx.includes([OUTCOME, LOAN, TRANSFER], type) ? null :
          <Fragment>
            <f.FormTextElement
              type='number'
              step='0.01'
              name='outcomeAmount'
              label={i18n.xln(context, i18n.AMOUNT)}
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'outcomeAmount'], u.parseNum)} />
            <f.FormSelectElement
              name='outcomeAccountId'
              label={i18n.xln(context, i18n.ACCOUNT)}
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'outcomeAccountId'])}>
              <option value='' />
              {fpx.map(accounts, ({id, title}) => (
                <option value={id} key={`outcome-account-${id}`}>
                  {title}
                </option>
              ))}
            </f.FormSelectElement>
          </Fragment>}

          {!fpx.includes([INCOME, BORROW, TRANSFER], type) ? null :
          <Fragment>
            <f.FormTextElement
              type='number'
              step='0.01'
              name='incomeAmount'
              label={i18n.xln(context, i18n.AMOUNT)}
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'incomeAmount'], u.parseNum)} />
            <f.FormSelectElement
              name='incomeAccountId'
              label={i18n.xln(context, i18n.ACCOUNT)}
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'incomeAccountId'])}>
              <option value='' />
              {fpx.map(accounts, ({id, title}) => (
                <option value={id} key={`income-account-${id}`}>
                  {title}
                </option>
              ))}
            </f.FormSelectElement>
          </Fragment>}

          {!fpx.includes([OUTCOME, INCOME], type) ? null :
          <f.FormSelectElement
            name='categoryId'
            label={i18n.xln(context, i18n.CATEGORY)}
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'categoryId'])}>
            <option value='' />
            {fpx.map(categories, ({id, title}) => (
              <option value={id} key={`category-${id}`}>
                {title}
              </option>
            ))}
          </f.FormSelectElement>}

          {!fpx.includes([OUTCOME, INCOME, LOAN, BORROW], type) ? null :
          <f.FormSelectElement
            name='payeeId'
            label={i18n.xln(context, i18n.PAYEE)}
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'payeeId'])}>
            <option value='' />
            {fpx.map(payees, ({id, title}) => (
              <option value={id} key={`payee-${id}`}>
                {title}
              </option>
            ))}
          </f.FormSelectElement>}

          <f.FormTextElement
            name='comment'
            label={i18n.xln(context, i18n.COMMENT)}
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'comment'])} />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-between-stretch padding-v-1 padding-h-1x25'>
          <div className='flex-1 row-start-stretch'>
            {!id ? null :
            <m.FakeButton
              className='btn-transparent'
              onClick={onDelete}
              disabled={disabled}>
              {i18n.xln(context, i18n.DELETE)}
            </m.FakeButton>}
          </div>
          <button
            type='submit'
            className={`btn-primary ${isMobile ? '' : 'btn-wide'}`}
            disabled={disabled}>
            {i18n.xln(context, i18n.SUBMIT)}
          </button>
          <div className='flex-1' />
        </div>
        {!errors ? null :
        <hr className='hr margin-h-1x25' />}
        <f.FormErrors errors={errors} />
      </form>
    )
  }
}

const TransactionForm = withRouter(connect(state => ({
  categories: state.net.categories.categoryList,
  accounts: state.net.accounts.accountList,
  payees: state.net.payees,
  pending: !fpx.isEmpty(state.net.pending),
}))(_TransactionForm))

class TransactionPlaceholder extends m.ViewComponent {
  render() {
    const {context} = this

    const isMobile = g.isMobile(context)

    return (
      <div className='row-start-center gaps-h-1 padding-h-1 list-item'>
        <div className='row-start-center padding-v-1'>
          <div className='relative width-2x5 square circle decorate-placeholder' />
        </div>
        <div className='flex-1 col-start-stretch transaction-line-height'>
          <div className='col-start-stretch gaps-v-0x25 padding-v-1'>
            <div className='row-between-center gaps-h-1 font-midsmall fg-on-surface-pale'>
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
        <div className='row-center-center padding-v-1 padding-h-0x25'>
          <div className='row-center-center' style={{minHeight: '2.5rem'}}>
            <s.Trash2 className='font-large fg-transparent' />
          </div>
        </div>}
      </div>
    )
  }
}

class _Transaction extends m.ViewComponent {
  constructor({dispatch}) {
    super(...arguments)
    this.actionsRef = React.createRef()

    const {context} = this

    this.onOpen = transaction => event => {
      const actionsNode = u.findDomNode(this.actionsRef.current)
      if (u.isAncestorOf(actionsNode, event.target)) return

      dispatch(a.addDialog(FormDialog, {
        form: TransactionForm,
        formProps: {transaction},
        title: i18n.xln(context, i18n.EDIT_TRANSACTION),
      }))
    }

    this.onDelete = transaction => () => {
      const {props} = this
      const {location} = props

      dispatch(a.addDialog(ConfirmDialog, {
        question: i18n.xln(context, i18n.DELETE_TRANSACTION),
        onConfirm: () => {
          dispatch(a.deleteTransaction(transaction.id, i18n.xln(context, i18n.DELETING_TRANSACTION)))
            .then(() => dispatch(a.addNotification(i18n.xln(context, i18n.TRANSACTION_DELETED))))
            .then(() => dispatch(a.fetchTransactions(location, i18n.xln(context, i18n.FETCHING_TRANSACTIONS))))
        },
      }))
    }
  }

  render() {
    const {
      context,
      props: {transaction},
      onOpen, onDelete, actionsRef,
    } = this

    const isMobile = g.isMobile(context)

    return (
      <m.FakeButton
        type='div'
        onClick={onOpen(transaction)}
        className='row-start-start gaps-h-1 padding-h-1 list-item trigger text-left theme-drawer-link-busy rounded'>
        <div className='row-start-center padding-v-1'>
          <TransactionIcon transaction={transaction} />
        </div>
        <div className='flex-1 col-start-stretch transaction-line-height'>
          <div className='col-start-stretch gaps-v-0x25 padding-v-1'>
            <div className='row-between-center gaps-h-1 font-midsmall fg-on-surface-pale'>
              <TransactionOrigin transaction={transaction} />
              <TransactionAccount transaction={transaction} />
            </div>
            <div className='row-between-start gaps-h-1'>
              <TransactionMeta transaction={transaction} />
              <TransactionAmount transaction={transaction} />
            </div>
          </div>
          <hr className='hr hide-in-list-last-child' />
        </div>
        {isMobile ? null :
        <div className='row-center-center padding-v-1 padding-h-0x25' ref={actionsRef}>
          <div className='row-center-center' style={{minHeight: '2.5rem'}}>
            <m.FakeButton
              className='row-center-center show-on-trigger-hover decorate-icon-button'
              onClick={onDelete(transaction)}>
              <s.Trash2 className='font-large' />
            </m.FakeButton>
          </div>
        </div>}
      </m.FakeButton>
    )
  }
}

const Transaction = withRouter(connect()(_Transaction))

class TransactionMeta extends m.ViewComponent {
  render() {
    const {
      context,
      props: {transaction},
    } = this

    const isMobile = g.isMobile(context)

    return isMobile ? (
      <span className='col-start-start gaps-v-0x25'>
        <span>{transaction.date}</span>
        <span>{transaction.comment}</span>
      </span>
    ) : (
      <span>
        {transaction.date} {transaction.comment ? '·' : ''} {transaction.comment}
      </span>
    )
  }
}

class TransactionIcon extends m.ViewComponent {
  render() {
    const {
      props: {transaction},
    } = this

    return (
      <div className='row-start-center'>
        {fpx.includes([OUTCOME, LOAN], transaction.type) ? (
        <div className='relative width-2x5 square circle bg-primary'>
          <div className='row-center-center abs-center fg-on-primary font-large'>
            <s.Minus />
          </div>
        </div>
        ) : fpx.includes([INCOME, BORROW], transaction.type) ? (
        <div className='relative width-2x5 square circle bg-primary'>
          <div className='row-center-center abs-center fg-on-primary font-large'>
            <s.Plus />
          </div>
        </div>
        ) : (
        <div className='relative width-2x5 square circle bg-primary'>
          <div className='row-center-center abs-center fg-on-primary font-large'>
            <s.Repeat />
          </div>
        </div>
        )}
      </div>
    )
  }
}

class TransactionAmount extends m.ViewComponent {
  render() {
    const {
      props: {transaction},
    } = this

    return (
      <span className='wspace-nowrap'>
        { transaction.type === BORROW
        ? <span className='fg-success'>+{transaction.outcomeAmount}</span>
        : transaction.type === LOAN
        ? <span className='fg-error'>-{transaction.incomeAmount}</span>
        : transaction.type === INCOME
        ? <span className='fg-success'>+{transaction.incomeAmount}</span>
        : transaction.type === OUTCOME
        ? <span className='fg-error'>-{transaction.outcomeAmount}</span>
        : <span>{transaction.outcomeAmount || transaction.incomeAmount}</span>}
      </span>
    )
  }
}

class _TransactionAccount extends m.ViewComponent {
  render() {
    const {
      props: {transaction, accountsById},
    } = this

    const outcomeAccount = accountsById[transaction.outcomeAccountId]
    const incomeAccount  = accountsById[transaction.incomeAccountId]

    return (
      <span className='row-start-center gaps-h-0x25 wspace-nowrap'>
        {!outcomeAccount ? null :
        <span>{outcomeAccount.title}</span>}
        {!outcomeAccount || !incomeAccount ? null :
        <s.ArrowRight />}
        {!incomeAccount ? null :
        <span>{incomeAccount.title}</span>}
      </span>
    )
  }
}

const TransactionAccount = connect(state => ({
  accountsById: state.net.accounts.accountsById,
}))(_TransactionAccount)

class _TransactionOrigin extends m.ViewComponent {
  render() {
    const {
      props: {transaction, categoriesById, payeesById},
    } = this

    return (
      <span className='flex-1 width-0 text-ellipsis gaps-h-0x5'>
        {!categoriesById[transaction.categoryId] ? null :
        <span className='gaps-h-0x25'>
          <s.Tag className='theme-drawer-icon' />
          <span>{categoriesById[transaction.categoryId].title}</span>
        </span>}
        {!payeesById[transaction.payeeId] ? null :
        <span className='gaps-h-0x25'>
          <s.Users className='theme-drawer-icon' />
          <span>{payeesById[transaction.payeeId].title}</span>
        </span>}
      </span>
    )
  }
}

const TransactionOrigin = connect(state => ({
  categoriesById: state.net.categories.categoriesById,
  payeesById: state.net.payeesById,
}))(_TransactionOrigin)

class _TransactionsList extends m.ViewComponent {
  render() {
    const {
      context,
      props: {outcomeAmount, incomeAmount, transactions, pageCount, pending},
    } = this

    const isMobile = g.isMobile(context)
    return (
      <div className='col-start-stretch gaps-v-2'>
        <div className='col-start-stretch gaps-v-0x25'>
          <div className={`row-between-center ${isMobile ? 'padding-t-0x5 padding-r-1' : 'padding-r-3x5'}`}>
            <FiltersControls />
            {pending ? null :
            <div className='gaps-h-0x5'>
              <span className='gaps-h-0x5'>
                <span className='fg-on-surface-pale'>{i18n.xln(context, i18n.OUTCOME)}:</span>
                <span className='fg-error'>-{outcomeAmount}</span>
              </span>
              <span className='fg-on-surface-pale'>/</span>
              <span className='gaps-h-0x5'>
                <span className='fg-on-surface-pale'>{i18n.xln(context, i18n.INCOME)}:</span>
                <span className='fg-success'>+{incomeAmount}</span>
              </span>
              <span className='fg-on-surface-pale'>
                ({i18n.xln(context, i18n.WITHOUT_DEBTS_AND_TRANSFERS)})
              </span>
            </div>}
          </div>
          {pending || !fpx.size(transactions) ? (
            <div className='col-start-stretch'>
              {fpx.map(new Array(fpx.size(transactions) || 3), (__, index) => (
                <TransactionPlaceholder key={`placeholder-${index}`} />
              ))}
            </div>
          ) : (
            <div className='col-start-stretch'>
              {fpx.map(transactions, transaction => (
                <Transaction key={transaction.id} transaction={transaction} />
              ))}
            </div>
          )}
        </div>
        {!fpx.size(transactions) ? null :
        <Paginator pageCount={pageCount} />}
      </div>
    )
  }
}

const TransactionsList = withRouter(connect(state => {
  return {
    outcomeAmount: state.net.transactions.outcomeAmount,
    incomeAmount : state.net.transactions.incomeAmount,
    transactions : state.net.transactions.items,
    pageCount    : Math.ceil(state.net.transactions.total / state.net.transactions.limit),
    pending      : !fpx.isEmpty(state.net.pending),
  }
})(_TransactionsList))



type FormDialogOwnProps = {
  onClose: void | ((event: KeyboardEvent) => void),
  title: string,
  form: React.ComponentType<P>,
  formProps: P,
}

type FormDialogStateProps = {}

type FormDialogProps = FormDialogOwnProps & FormDialogStateProps

class _FormDialog extends m.ViewComponent<FormDialogProps> {
  close = (event) => {
    const {dispatch, onClose} = this.props
    dispatch(a.removeDialog())

    if (onClose) {
      onClose(event)
    }
  }

  render() {
    const {
      context,
      props: {title, form: Form, formProps},
      close,
    } = this

    if (g.isMobile(context)) {
      return (
        <d.Dialog onEscape={close}>
          <d.DialogScrollable className='bg-surface'>
            <div className='relative col-start-stretch'>
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
              <Form {...formProps} onSubmitSuccess={close} />}
            </div>
          </d.DialogScrollable>
        </d.Dialog>
      )
    }

    return (
      <d.Dialog onEscape={close}>
        <d.DialogOverlay className='bg-overlay' />
        <d.DialogCentered onClick={close}>
          <div
            className='col-start-stretch rounded bg-surface shadow-dept-3'
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
            <Form {...formProps} onSubmitSuccess={close} />}
          </div>
        </d.DialogCentered>
      </d.Dialog>
    )
  }
}

export const FormDialog = connect<FormDialogStateProps, {}, FormDialogOwnProps, t.AppState>()(_FormDialog)

class _ConfirmDialog extends m.ViewComponent {
  constructor({dispatch}) {
    super(...arguments)

    this.close = () => {
      dispatch(a.removeDialog())
      if (this.props.onClose) this.props.onClose()
    }

    this.confirm = () => {
      dispatch(a.removeDialog())
      if (this.props.onConfirm) this.props.onConfirm()
    }
  }

  render() {
    const {
      context,
      props: {question, cancelText, confirmText},
      confirm, close,
    } = this

    return (
      <d.Dialog onEscape={close}>
        <d.DialogOverlay className='bg-overlay' />
        <d.DialogCentered onClick={close}>
          <div
            className='col-start-stretch gaps-v-1 padding-v-1 rounded bg-surface shadow-dept-3'
            style={{minWidth: '11rem'}}>
            <p className='padding-h-1x25 font-midlarge weight-medium'>
              {question}
            </p>
            <div className='row-center-center gaps-h-1'>
              <m.FakeButton className='btn-secondary' onClick={close}>
                {cancelText || i18n.xln(context, i18n.CANCEL)}
              </m.FakeButton>
              <m.FakeButton className='btn-primary' onClick={confirm}>
                {confirmText || i18n.xln(context, i18n.OK)}
              </m.FakeButton>
            </div>
          </div>
        </d.DialogCentered>
      </d.Dialog>
    )
  }
}

export const ConfirmDialog = connect()(_ConfirmDialog)



/**
 * Misc
 */

type ListPageProps = {
  action: t.RReactElement,
}

export class ListPage extends m.ViewComponent<ListPageProps> {
  render() {
    const {
      context,
      props: {action, children},
    } = this

    if (g.isMobile(context)) {
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
        <div className='limit-content-width col-start-stretch gaps-v-1 padding-b-2'>
          <div className='col-start-stretch padding-h-0x5' style={{marginTop: '-1.75rem'}}>
            {action}
          </div>
          {children}
        </div>
      </PageLayout>
    )
  }
}

class _Paginator extends m.ViewComponent {
  constructor() {
    super(...arguments)

    const query = u.decodeQuery(this.props.location.search)
    this.state = {forcePage: parseInt(query.page, 10) || 1}

    this.onPageChange = ({selected}) => {
      const {props} = this
      const {history, location, onPageChange} = props

      const query = u.decodeQuery(location.search)
      const page = selected + 1
      history.push(`/transactions/${u.encodeQuery({...query, page})}`)

      if (fpx.isFunction(onPageChange)) onPageChange(page)
    }

    this.hrefBulder = page => {
      const query = u.decodeQuery(this.props.location.search)
      return `/transactions/${u.encodeQuery({...query, page})}`
    }
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(nextLocation => {
      const location = this.props.location
      if (location.pathname !== nextLocation.pathname) return

      const nextQuery = u.decodeQuery(nextLocation.search)
      this.setState({forcePage: parseInt(nextQuery.page, 10) || 1})
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const {
      context,
      props: {pageCount}, state: {forcePage},
      onPageChange, hrefBulder,
    } = this

    const isMobile = g.isMobile(context)

    return (
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={isMobile ? 2 : 3}
        marginPagesDisplayed={isMobile ? 1 : 2}
        previousLabel={<s.ArrowLeft />}
        nextLabel={<s.ArrowRight />}
        breakLabel='...'
        breakClassName={`block ${isMobile ? '' : 'padding-h-0x75'}`}
        breakLinkClassName='btn-secondary row-center-center'
        onPageChange={onPageChange}
        forcePage={forcePage - 1}
        disableInitialCallback={true}
        containerClassName={`${isMobile
          ? 'col-start-stretch gaps-v-1 padding-h-1x25'
          : 'row-center-center gaps-h-0x25'}`}
        pageClassName='block'
        pageLinkClassName='btn-secondary row-center-center'
        previousClassName='block'
        previousLinkClassName='btn-secondary row-center-center'
        nextClassName='block'
        nextLinkClassName='btn-secondary row-center-center'
        hrefBuilder={hrefBulder}
        ariaLabelBuilder={page => `${i18n.xln(context, i18n.PAGE)} ${page}`}
      />
    )
  }
}

const Paginator = withRouter(_Paginator)

class _FiltersForm extends m.ViewComponent {
  constructor() {
    super(...arguments)

    this.state = {
      formValues: getFilterValues(this.props.location),
    }

    this.onSubmit = event => {
      event.preventDefault()

      const {props, state} = this
      const {history, location, onSubmitSuccess} = props
      const {formValues} = state

      const query = u.decodeQuery(location.search)
      history.push(`/transactions/${u.encodeQuery({
        ...query,
        ...formValues,
        dateFrom: u.formatDate(formValues.dateFrom),
        dateTo  : u.formatDate(formValues.dateTo),
        page    : undefined,
      })}`)

      if (fpx.isFunction(onSubmitSuccess)) onSubmitSuccess(this.state.formValues)
    }

    this.onReset = event => {
      event.preventDefault()

      const {props} = this
      const {history, location} = props

      resetFilters(history, location)
    }
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(nextLocation => {
      const location = this.props.location
      if (location.pathname !== nextLocation.pathname) return

      this.setState({
        formValues: getFilterValues(nextLocation),
      })
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const {
      context,
      props: {accounts, categories, payees, pending},
      state: {formValues},
      onSubmit, onReset,
    } = this

    const isMobile = g.isMobile(context)
    const noFilters = fpx.isEmpty(u.omitEmpty(formValues))
    return (
      <form className='col-start-stretch' onSubmit={onSubmit} onReset={onReset}>
        <div className={`col-start-stretch ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}>
          <f.FormDateElement
            name='dateFrom'
            label={i18n.xln(context, i18n.DATE_FROM)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'dateFrom'])} />

          <f.FormDateElement
            name='dateTo'
            label={i18n.xln(context, i18n.DATE_TO)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'dateTo'])} />

          <f.FormSelectElement
            name='accountId'
            label={i18n.xln(context, i18n.ACCOUNT)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'accountId'])}>
            <option value='' />
            {fpx.map(accounts, ({id, title}) => (
              <option value={id} key={`income-account-${id}`}>
                {title}
              </option>
            ))}
          </f.FormSelectElement>

          <f.FormSelectElement
            name='categoryId'
            label={i18n.xln(context, i18n.CATEGORY)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'categoryId'])}>
            <option value='' />
            {fpx.map(categories, ({id, title}) => (
              <option value={id} key={`category-${id}`}>
                {title}
              </option>
            ))}
          </f.FormSelectElement>

          <f.FormSelectElement
            name='payeeId'
            label={i18n.xln(context, i18n.PAYEE)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'payeeId'])}>
            <option value='' />
            {fpx.map(payees, ({id, title}) => (
              <option value={id} key={`payee-${id}`}>
                {title}
              </option>
            ))}
          </f.FormSelectElement>

          <f.FormTextElement
            name='comment'
            label={i18n.xln(context, i18n.COMMENT)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'comment'])} />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-between-stretch padding-v-1 padding-h-1x25'>
          <div className='flex-1 row-start-stretch'>
            <button
              type='reset'
              className='btn-transparent'
              disabled={pending || noFilters}>
              {i18n.xln(context, i18n.RESET)}
            </button>
          </div>
          <button
            type='submit'
            className={`btn-primary ${isMobile ? '' : 'btn-wide'}`}
            disabled={pending}>
            {i18n.xln(context, i18n.APPLY)}
          </button>
          <div className='flex-1' />
        </div>
      </form>
    )
  }
}

const FiltersForm = withRouter(connect(state => ({
  categories: state.net.categories.categoryList,
  accounts: state.net.accounts.accountList,
  payees: state.net.payees,
  pending: !fpx.isEmpty(state.net.pending),
}))(_FiltersForm))

class _FiltersControls extends m.ViewComponent {
  render() {
    const {
      context,
      props: {transactions, pending, dispatch, history, location},
    } = this

    const noFilters = fpx.isEmpty(u.omitEmpty(getFilterValues(location)))

    return (
      <div className='row-start-center padding-h-1 flex-wrap'>
        <div className='row-start-center gaps-h-0x5'>
          <m.FakeButton
            className='decorate-link'
            disabled={pending || !fpx.size(transactions)}
            onClick={() => dispatch(a.addDialog(FormDialog, {
              form: FiltersForm,
              title: i18n.xln(context, i18n.FILTERS),
            }))}>
            {i18n.xln(context, i18n.FILTERS)}
          </m.FakeButton>
          {noFilters ? null :
          <m.FakeButton
            className='decorate-link row-center-center bg-primary rounded-50p'
            style={{padding: '2px'}}
            disabled={pending}
            onClick={() => resetFilters(history, location)}>
            <s.X className='fg-surface' />
          </m.FakeButton>}
        </div>
      </div>
    )
  }
}

const FiltersControls = withRouter(connect(state => ({
  transactions: state.net.transactions.items,
  pending: !fpx.isEmpty(state.net.pending),
}))(_FiltersControls))

function getFilterValues(location) {
  const query = u.decodeQuery(location.search)

  return {
    dateFrom  : u.toValidDate(query.dateFrom),
    dateTo    : u.toValidDate(query.dateTo),
    accountId : query.accountId,
    categoryId: query.categoryId,
    payeeId   : query.payeeId,
    comment   : query.comment,
  }
}

function resetFilters(history, location) {
  const query = u.decodeQuery(location.search)
  history.push(`/transactions/${u.encodeQuery({
    ...query,
    dateFrom  : undefined,
    dateTo    : undefined,
    accountId : undefined,
    categoryId: undefined,
    payeeId   : undefined,
    comment   : undefined,
    page      : undefined,
  })}`)
}

export class Fab extends m.ViewComponent {
  render() {
    const {props: {className: cls, ...props}} = this

    return (
      <m.FakeButton
        className={`row-start-stretch width-3x5 ${cls || ''}`}
        {...props}>
        <span className='flex-1 relative circle square bg-accent shadow-dept-2'>
          <s.Plus className='abs-center font-giant fg-on-accent' />
        </span>
      </m.FakeButton>
    )
  }
}

// TODO Unused. Candidate to delete
class _ActionsMenu extends m.ViewComponent {
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

  render() {
    const {
      props: {children},
      state: {expanded},
      toggle, close,
    } = this

    return !children ? null : (
      <div className='relative row-start-stretch'>
        <m.FakeButton
          onClick={toggle}
          className='relative row-start-center decorate-drawer-link z-index-2'
          aria-expanded={expanded}>
          <s.MoreVertical className='font-large' />
        </m.FakeButton>
        {!expanded ? null :
        <m.Closer root={this} close={close}>
          <div
            className='dropdown-position z-index-1'
            onClick={close}>
            <div className='dropdown dropdown-padding col-start-stretch' style={{minWidth: '11rem'}}>
              {children}
            </div>
          </div>
        </m.Closer>}
      </div>
    )
  }
}

export class Page404 extends m.ViewComponent {
  render() {
    const {context} = this

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

    if (g.isMobile(context)) {
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
