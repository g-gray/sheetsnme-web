import * as t from '../types'

import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

// @ts-ignore
import * as fpx from 'fpx'

import * as u from '../utils'

import * as a from '../actions'

import * as g from '../geometry'
import * as i18n from '../i18n'

import * as m from '../views/misc'
import * as s from '../views/svg'
import * as f from '../views/forms'

import * as p from '../views/pages'
import * as v from '../views'

class _TransactionsPage extends m.ViewComponent {
  render() {
    const {
      context,
      props: {dispatch},
    } = this

    const action = (
      <v.Fab
        onClick={() => dispatch(a.addDialog(p.FormDialog, {
          form: TransactionForm,
          title: i18n.xln(context, i18n.NEW_TRANSACTION),
        }))}
      />
    )

    return (
      <v.ListPage action={action}>
        <TransactionsList />
      </v.ListPage>
    )
  }
}

export const TransactionsPage = connect()(_TransactionsPage)

type TransactionFormOwnProps = t.RRRouteComponentProps & {
  transaction: t.TransactionRes,
  onSubmitSuccess: () => void,
}

type TransactionFormStateProps = {
  pending: boolean,
  categories: t.CategoryListRes,
  accounts: t.AccountListRes,
  payees: t.PayeeListRes,
}

type TransactionFormProps = TransactionFormOwnProps & TransactionFormStateProps

type TransactionFormState = {
  formValues: t.TransactionRes,
  errors: undefined | t.ValidationError[],
}

class _TransactionForm extends m.ViewComponent<TransactionFormProps, TransactionFormState> {
  state: Readonly<TransactionFormState> = {
    formValues: this.props.transaction || {
      type: t.TRANSACTION_TYPE.OUTCOME,
      date: u.formatDate(new Date()),
    },
    errors: undefined,
  }

  onSubmit = (event: t.RFormEvent) => {
    u.preventDefault(event)

    this.setState({errors: undefined})

    const {
      context,
      props: {dispatch, location, onSubmitSuccess},
      state: {formValues},
    } = this

    const data = {
      ...formValues,
      date: u.formatDate(formValues.date),
    }

    const promise = formValues.id
      ? dispatch(a.updateTransaction(
          formValues.id,
          data,
          i18n.xln(context, i18n.UPDATING_TRANSACTION)
        ))
      : dispatch(a.createTransaction(
          data,
          i18n.xln(context, i18n.CREATING_TRANSACTION)
        ))

    promise
      .catch(errors => {
        this.setState({errors})
        throw errors
      })
      .then(() => onSubmitSuccess())
      .then(() => dispatch(a.addNotification(formValues.id
          ? i18n.xln(context, i18n.TRANSACTION_UPDATED)
          : i18n.xln(context, i18n.TRANSACTION_CREATED)
      )))
      .then(() => dispatch(a.fetchTransactions(
        location,
        i18n.xln(context, i18n.FETCHING_TRANSACTIONS))
      ))
  }

  onDelete = (event: v.FakeButtonEvent): void => {
    u.preventDefault(event)

    this.setState({errors: undefined})

    const {
      context,
      props: {dispatch, location, onSubmitSuccess},
      state: {formValues},
    } = this

    dispatch(a.addDialog(p.ConfirmDialog, {
      question: i18n.xln(context, i18n.DELETE_TRANSACTION),
      onConfirm: () => {
        dispatch(a.deleteTransaction(
          formValues.id,
          i18n.xln(context, i18n.DELETING_TRANSACTION)
        ))
          .then(() => {onSubmitSuccess()})
          .then(() => dispatch(a.addNotification(i18n.xln(context, i18n.TRANSACTION_DELETED))))
          .then(() => dispatch(a.fetchTransactions(
            location,
            i18n.xln(context, i18n.FETCHING_TRANSACTIONS)
          )))
      },
    }))
  }

  onTypeUpdated = value => {
    const {formValues} = this.state
    const {type, outcomeAccountId, outcomeAmount, incomeAccountId, incomeAmount} = formValues

    if (
      fpx.includes([t.TRANSACTION_TYPE.OUTCOME, t.TRANSACTION_TYPE.LOAN], type) &&
      fpx.includes([t.TRANSACTION_TYPE.INCOME, t.TRANSACTION_TYPE.BORROW], value)
    ) {
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

    if (
      fpx.includes([t.TRANSACTION_TYPE.INCOME, t.TRANSACTION_TYPE.BORROW], type) &&
      fpx.includes([t.TRANSACTION_TYPE.OUTCOME, t.TRANSACTION_TYPE.LOAN], value)
    ) {
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

    if (
      fpx.includes([t.TRANSACTION_TYPE.OUTCOME, t.TRANSACTION_TYPE.LOAN], type) &&
      fpx.includes([t.TRANSACTION_TYPE.TRANSFER], value)
    ) {
      this.setState({
        formValues: {
          ...formValues,
          type: value,
          incomeAmount: outcomeAmount,
        },
      })
      return
    }

    if (
      fpx.includes([t.TRANSACTION_TYPE.INCOME, t.TRANSACTION_TYPE.BORROW], type) &&
      fpx.includes([t.TRANSACTION_TYPE.TRANSFER], value)
    ) {
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
      <form
        className='col-start-stretch'
        onSubmit={onSubmit}
      >
        <div
          className={`col-start-stretch
                      ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}
        >
          <f.FormDateElement
            name='date'
            label={i18n.xln(context, i18n.DATE)}
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'date'])}
          />
          <f.G7FormLine>
            <f.FormLabel>
              {i18n.xln(context, i18n.TYPE)}
            </f.FormLabel>
            <div className='col-start-stretch gaps-v-0x5'>
              <div className={isMobile ? 'col-start-stretch gaps-v-0x5' : 'row-start-center gaps-h-1'}>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], t.TRANSACTION_TYPE.OUTCOME)}
                    onUpdate={onTypeUpdated}
                  />
                  <span>{i18n.xln(context, i18n.OUTCOME)}</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], t.TRANSACTION_TYPE.INCOME)}
                    onUpdate={onTypeUpdated}
                  />
                  <span>{i18n.xln(context, i18n.INCOME)}</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], t.TRANSACTION_TYPE.TRANSFER)}
                    onUpdate={onTypeUpdated}
                  />
                  <span>{i18n.xln(context, i18n.TRANSFER)}</span>
                </label>
              </div>
              <div className={isMobile ? 'col-start-stretch gaps-v-0x5' : 'row-start-center gaps-h-1'}>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], t.TRANSACTION_TYPE.LOAN)}
                    onUpdate={onTypeUpdated}
                  />
                  <span>{i18n.xln(context, i18n.I_LOANED)}</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={disabled}
                    {...u.bindChecked(this, ['formValues', 'type'], t.TRANSACTION_TYPE.BORROW)}
                    onUpdate={onTypeUpdated}
                  />
                  <span>{i18n.xln(context, i18n.I_BORROWED)}</span>
                </label>
              </div>
            </div>
          </f.G7FormLine>

          {!fpx.includes([
            t.TRANSACTION_TYPE.OUTCOME,
            t.TRANSACTION_TYPE.LOAN,
            t.TRANSACTION_TYPE.TRANSFER,
          ], type) ? null :
          <Fragment>
            <f.FormTextElement
              type='number'
              step='0.01'
              name='outcomeAmount'
              label={i18n.xln(context, i18n.AMOUNT)}
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'outcomeAmount'], u.parseNum)}
            />
            <f.FormSelectElement
              name='outcomeAccountId'
              label={i18n.xln(context, i18n.ACCOUNT)}
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'outcomeAccountId'])}
            >
              <option value='' />
              {accounts.map(({id, title}) => (
                <option
                  key={id}
                  value={id}
                >
                  {title}
                </option>
              ))}
            </f.FormSelectElement>
          </Fragment>}

          {!fpx.includes([
            t.TRANSACTION_TYPE.INCOME,
            t.TRANSACTION_TYPE.BORROW,
            t.TRANSACTION_TYPE.TRANSFER,
          ], type) ? null :
          <Fragment>
            <f.FormTextElement
              type='number'
              step='0.01'
              name='incomeAmount'
              label={i18n.xln(context, i18n.AMOUNT)}
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'incomeAmount'], u.parseNum)}
            />
            <f.FormSelectElement
              name='incomeAccountId'
              label={i18n.xln(context, i18n.ACCOUNT)}
              disabled={disabled}
              {...u.bindValue(this, ['formValues', 'incomeAccountId'])}
            >
              <option value='' />
              {accounts.map(({id, title}) => (
                <option
                  key={id}
                  value={id}
                >
                  {title}
                </option>
              ))}
            </f.FormSelectElement>
          </Fragment>}

          {!fpx.includes([
            t.TRANSACTION_TYPE.OUTCOME,
            t.TRANSACTION_TYPE.INCOME,
          ], type) ? null :
          <f.FormSelectElement
            name='categoryId'
            label={i18n.xln(context, i18n.CATEGORY)}
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'categoryId'])}
          >
            <option value='' />
            {categories.map(({id, title}) => (
              <option
                key={id}
                value={id}
              >
                {title}
              </option>
            ))}
          </f.FormSelectElement>}

          {!fpx.includes([
            t.TRANSACTION_TYPE.OUTCOME,
            t.TRANSACTION_TYPE.INCOME,
            t.TRANSACTION_TYPE.LOAN,
            t.TRANSACTION_TYPE.BORROW,
          ], type) ? null :
          <f.FormSelectElement
            name='payeeId'
            label={i18n.xln(context, i18n.PAYEE)}
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'payeeId'])}
          >
            <option value='' />
            {payees.map(({id, title}) => (
              <option
                key={id}
                value={id}
              >
                {title}
              </option>
            ))}
          </f.FormSelectElement>}

          <f.FormTextElement
            name='comment'
            label={i18n.xln(context, i18n.COMMENT)}
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'comment'])}
          />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-between-stretch padding-v-1 padding-h-1x25'>
          <div className='flex-1 row-start-stretch'>
            {!id ? null :
            <v.FakeButton
              className='btn-transparent'
              onClick={onDelete}
              disabled={disabled}
            >
              {i18n.xln(context, i18n.DELETE)}
            </v.FakeButton>}
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

const TransactionForm = withRouter(connect<TransactionFormStateProps, {}, TransactionFormOwnProps, t.AppState>(state => ({
  categories: state.net.categories.categoryList,
  accounts: state.net.accounts.accountList,
  payees: state.net.payees.payeeList,
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
              <p.Placeholder style={{width: '4em'}} />
              <p.Placeholder style={{width: '6em'}} />
            </div>
            <div className='row-between-start gaps-h-1'>
              <p.Placeholder style={{width: '8em'}} />
              <p.Placeholder style={{width: '3em'}} />
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


type TransactionProps = t.RRRouteComponentProps & {
  transaction: t.TransactionRes,
}

class _Transaction extends m.ViewComponent<TransactionProps> {
  actionsRef = React.createRef<HTMLDivElement>()

  onOpen = (transaction: t.TransactionRes) => {
    return (event: v.FakeButtonEvent): void => {
      const {
        context,
        props: {dispatch},
      } = this

      const actionsNode = u.findDomNode(this.actionsRef.current)
      if (u.isAncestorOf(actionsNode, event.target)) return

      dispatch(a.addDialog(p.FormDialog, {
        form: TransactionForm,
        formProps: {transaction},
        title: i18n.xln(context, i18n.EDIT_TRANSACTION),
      }))
    }
  }

  onDelete = (transaction: t.TransactionRes) => () => {
    const {
      context,
      props: {dispatch, location},
    } = this

    dispatch(a.addDialog(p.ConfirmDialog, {
      question: i18n.xln(context, i18n.DELETE_TRANSACTION),
      onConfirm: () => {
        dispatch(a.deleteTransaction(
          transaction.id,
          i18n.xln(context, i18n.DELETING_TRANSACTION)
        ))
          .then(() => dispatch(a.addNotification(i18n.xln(context, i18n.TRANSACTION_DELETED))))
          .then(() => dispatch(a.fetchTransactions(
            location,
            i18n.xln(context, i18n.FETCHING_TRANSACTIONS)
          )))
      },
    }))
  }

  render() {
    const {
      context,
      props: {transaction},
      onOpen, onDelete, actionsRef,
    } = this

    const isMobile = g.isMobile(context)

    return (
      <v.FakeButton
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
        <div
          ref={actionsRef}
          className='row-center-center padding-v-1 padding-h-0x25'
        >
          <div
            className='row-center-center'
            style={{minHeight: '2.5rem'}}
          >
            <v.FakeButton
              className='row-center-center show-on-trigger-hover decorate-icon-button'
              onClick={onDelete(transaction)}>
              <s.Trash2 className='font-large' />
            </v.FakeButton>
          </div>
        </div>}
      </v.FakeButton>
    )
  }
}

const Transaction = withRouter(connect()(_Transaction))


type TransactionMetaProps = {
  transaction: t.TransactionRes,
}

class TransactionMeta extends m.ViewComponent<TransactionMetaProps> {
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


type TransactionIconProps = {
  transaction: t.TransactionRes,
}

class TransactionIcon extends m.ViewComponent<TransactionIconProps> {
  render() {
    const {
      props: {transaction},
    } = this

    return (
      <div className='row-start-center'>
        {fpx.includes([t.TRANSACTION_TYPE.OUTCOME, t.TRANSACTION_TYPE.LOAN], transaction.type) ? (
          <div className='relative width-2x5 square circle bg-primary'>
            <div className='row-center-center abs-center fg-on-primary font-large'>
              <s.Minus />
            </div>
          </div>
        ) : fpx.includes([t.TRANSACTION_TYPE.INCOME, t.TRANSACTION_TYPE.BORROW], transaction.type) ? (
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


type TransactionAmountProps = {
  transaction: t.TransactionRes,
}

class TransactionAmount extends m.ViewComponent<TransactionAmountProps> {
  render() {
    const {
      props: {transaction},
    } = this

    return (
      <span className='wspace-nowrap'>
        { transaction.type === t.TRANSACTION_TYPE.BORROW
        ? <span className='fg-success'>+{transaction.outcomeAmount}</span>
        : transaction.type === t.TRANSACTION_TYPE.LOAN
        ? <span className='fg-error'>-{transaction.incomeAmount}</span>
        : transaction.type === t.TRANSACTION_TYPE.INCOME
        ? <span className='fg-success'>+{transaction.incomeAmount}</span>
        : transaction.type === t.TRANSACTION_TYPE.OUTCOME
        ? <span className='fg-error'>-{transaction.outcomeAmount}</span>
        : <span>{transaction.outcomeAmount || transaction.incomeAmount}</span>}
      </span>
    )
  }
}

type TransactionAccountOwnProps = {
  transaction: t.TransactionRes,
}

type TransactionAccountStateProps = {
  accountsById: t.AccountsById,
}

type TransactionAccountProps = TransactionAccountOwnProps & TransactionAccountStateProps

class _TransactionAccount extends m.ViewComponent<TransactionAccountProps> {
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

const TransactionAccount = connect<TransactionAccountStateProps, {}, TransactionAccountOwnProps, t.AppState>(state => ({
  accountsById: state.net.accounts.accountsById,
}))(_TransactionAccount)


type TransactionOriginOwnProps = {
  transaction: t.TransactionRes,
}

type TransactionOriginStateProps = {
  categoriesById: t.CategoriesById,
  payeesById: t.PayeesById,
}

type TransactionOriginProps = TransactionOriginOwnProps & TransactionOriginStateProps

class _TransactionOrigin extends m.ViewComponent<TransactionOriginProps> {
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

const TransactionOrigin = connect<TransactionOriginStateProps, {}, TransactionOriginOwnProps, t.AppState>(state => ({
  categoriesById: state.net.categories.categoriesById,
  payeesById: state.net.payees.payeesById,
}))(_TransactionOrigin)


type TransactionListStateProps = {
  outcomeAmount: number,
  incomeAmount : number,
  pageCount    : number,
  transactions : t.TransactionRes[],
  pending      : boolean,
}

type TransactionListOwnProps = t.RRRouteComponentProps

type TransactionListProps = TransactionListOwnProps & TransactionListStateProps

class _TransactionsList extends m.ViewComponent<TransactionListProps> {
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
            <TransactionFiltersControls />
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
              {new Array(transactions.length || 3).fill(undefined).map((__, index) => (
                <TransactionPlaceholder key={`placeholder-${index}`} />
              ))}
            </div>
          ) : (
            <div className='col-start-stretch'>
              {transactions.map(transaction => (
                <Transaction key={transaction.id} transaction={transaction} />
              ))}
            </div>
          )}
        </div>
        {!transactions.length ? null :
        <v.Paginator pageCount={pageCount} />}
      </div>
    )
  }
}

const TransactionsList = withRouter(connect<TransactionListStateProps, {}, TransactionListOwnProps, t.AppState>(state => {
  return {
    outcomeAmount: state.net.transactions.transactionList.outcomeAmount,
    incomeAmount : state.net.transactions.transactionList.incomeAmount,
    transactions : state.net.transactions.transactionList.items,
    pageCount    : Math.ceil(state.net.transactions.transactionList.total / state.net.transactions.transactionList.limit),
    pending      : !fpx.isEmpty(state.net.pending),
  }
})(_TransactionsList))



type TransactionFiltersFormOwnProps = t.RRRouteComponentProps & {
  onSubmitSuccess: (formValues: t.TransactionsFilterForm) => void,
}

type TransactionFiltersFormStateProps = {
  categories: t.CategoryListRes,
  accounts: t.AccountListRes,
  payees: t.PayeeListRes,
  pending: boolean,
}

type TransactionFiltersFormProps = TransactionFiltersFormOwnProps & TransactionFiltersFormStateProps

type TransactionFiltersFormState = {
  formValues: t.TransactionsFilterForm,
}

class _TransactionFiltersForm extends m.ViewComponent<TransactionFiltersFormProps, TransactionFiltersFormState> {
  state: Readonly<TransactionFiltersFormState> = {
    formValues: getFilterValues(this.props.location),
  }
  unlisten: () => void = () => {}

  onSubmit = (event: t.RFormEvent) => {
    u.preventDefault(event)

    const {
      props: {history, location, onSubmitSuccess},
      state: {formValues},
    } = this

    const query = u.decodeQuery(location.search)
    history.push(`/transactions/${u.encodeQuery({
      ...query,
      ...formValues,
      dateFrom: u.formatDate(formValues.dateFrom),
      dateTo  : u.formatDate(formValues.dateTo),
      page    : undefined,
    })}`)

    if (typeof onSubmitSuccess === 'function') {
      onSubmitSuccess(this.state.formValues)
    }
  }

  onReset = (event: t.RFormEvent) => {
    u.preventDefault(event)

    const {props: {history, location}} = this

    resetFilters(history, location)
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
            {...u.bindValue(this, ['formValues', 'dateFrom'])}
          />

          <f.FormDateElement
            name='dateTo'
            label={i18n.xln(context, i18n.DATE_TO)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'dateTo'])}
          />

          <f.FormSelectElement
            name='accountId'
            label={i18n.xln(context, i18n.ACCOUNT)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'accountId'])}
          >
            <option value='' />
            {accounts.map(({id, title}) => (
              <option
                key={id}
                value={id}
              >
                {title}
              </option>
            ))}
          </f.FormSelectElement>

          <f.FormSelectElement
            name='categoryId'
            label={i18n.xln(context, i18n.CATEGORY)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'categoryId'])}
          >
            <option value='' />
            {categories.map(({id, title}) => (
              <option
                key={id}
                value={id}
              >
                {title}
              </option>
            ))}
          </f.FormSelectElement>

          <f.FormSelectElement
            name='payeeId'
            label={i18n.xln(context, i18n.PAYEE)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'payeeId'])}
          >
            <option value='' />
            {payees.map(({id, title}) => (
              <option
                key={id}
                value={id}
              >
                {title}
              </option>
            ))}
          </f.FormSelectElement>

          <f.FormTextElement
            name='comment'
            label={i18n.xln(context, i18n.COMMENT)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'comment'])}
          />
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
            disabled={pending}
          >
            {i18n.xln(context, i18n.APPLY)}
          </button>
          <div className='flex-1' />
        </div>
      </form>
    )
  }
}

const TransactoinFiltersForm = withRouter(connect<TransactionFiltersFormStateProps, {}, TransactionFiltersFormOwnProps, t.AppState>(state => ({
  categories: state.net.categories.categoryList,
  accounts: state.net.accounts.accountList,
  payees: state.net.payees.payeeList,
  pending: !fpx.isEmpty(state.net.pending),
}))(_TransactionFiltersForm))



type TransactionFiltersControlsOwnProps = t.RRRouteComponentProps

type TransactionFiltersControlsStateProps = {
  transactions: t.TransactionRes[],
  pending: boolean,
}

type TransactionFiltersControlsProps = TransactionFiltersControlsOwnProps & TransactionFiltersControlsStateProps

class _TransactionFiltersControls extends m.ViewComponent<TransactionFiltersControlsProps> {
  render() {
    const {
      context,
      props: {dispatch, history, location, transactions, pending},
    } = this

    const noFilters = fpx.isEmpty(u.omitEmpty(getFilterValues(location)))

    return (
      <div className='row-start-center padding-h-1 flex-wrap'>
        <div className='row-start-center gaps-h-0x5'>
          <v.FakeButton
            className='decorate-link'
            disabled={pending || !fpx.size(transactions)}
            onClick={() => dispatch(a.addDialog(p.FormDialog, {
              form: TransactoinFiltersForm,
              title: i18n.xln(context, i18n.FILTERS),
            }))}
          >
            {i18n.xln(context, i18n.FILTERS)}
          </v.FakeButton>
          {noFilters ? null :
          <v.FakeButton
            className='decorate-link row-center-center bg-primary rounded-50p'
            style={{padding: '2px'}}
            disabled={pending}
            onClick={() => resetFilters(history, location)}
          >
            <s.X className='fg-surface' />
          </v.FakeButton>}
        </div>
      </div>
    )
  }
}

const TransactionFiltersControls = withRouter(connect<TransactionFiltersControlsStateProps, {}, TransactionFiltersControlsOwnProps, t.AppState>(state => ({
  transactions: state.net.transactions.transactionList.items,
  pending: !fpx.isEmpty(state.net.pending),
}))(_TransactionFiltersControls))

function getFilterValues(location: t.RRLocation): t.TransactionsFilterForm {
  const query = u.decodeQuery(location.search)

  return {
    dateFrom  : u.toValidDate(u.mayBeFirstQueryParam(query.dateFrom)),
    dateTo    : u.toValidDate(u.mayBeFirstQueryParam(query.dateTo)),
    accountId : u.mayBeFirstQueryParam(query.accountId),
    categoryId: u.mayBeFirstQueryParam(query.categoryId),
    payeeId   : u.mayBeFirstQueryParam(query.payeeId),
    comment   : u.mayBeFirstQueryParam(query.comment),
  }
}

function resetFilters(history: t.RRHistory, location: t.RRLocation) {
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
