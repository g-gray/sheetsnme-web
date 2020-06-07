import * as t from '../../types'

import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

// @ts-ignore
import * as fpx from 'fpx'

import * as e from '../../env'
import * as u from '../../utils'

import * as a from '../../actions'

import * as i18n from '../../i18n'
import * as d from '../../dialogs'

import * as v from '../../views'
import * as s from '../../views/svg'

/**
 * TransactionFiltersForm
 */

type TransactionFiltersFormOwnProps =  t.RRRouteComponentProps

type TransactionFiltersFormStateProps = {
  categories: t.CategoryListRes,
  accounts  : t.AccountListRes,
  payees    : t.PayeeListRes,
  pending   : boolean,
}

type TransactionFiltersFormProps = TransactionFiltersFormOwnProps & TransactionFiltersFormStateProps

type TransactionFiltersFormState = {
  formValues: t.TransactionsFilterForm,
}


class _TransactionFiltersForm extends v.ViewComponent<TransactionFiltersFormProps, TransactionFiltersFormState> {
  readonly state = {
    formValues: parseFilters(this.props.location.search),
  }

  unlisten: () => void = () => {}

  onSubmit = (event: t.RFormEvent) => {
    u.preventDefault(event)

    const {
      props: {history, location},
      state: {formValues},
    } = this

    const query = u.decodeQuery(location.search)
    history.push(`/transactions/${u.encodeQuery({
      ...query,
      ...stringifyFilters(formValues),
      page: undefined,
    })}`)
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
        formValues: parseFilters(nextLocation.search),
      })
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const {
      context, context: {isMobile},
      props: {accounts, categories, payees, pending},
      state: {formValues},
      onSubmit, onReset,
    } = this

    const noFilters = fpx.isEmpty(u.omitEmpty(formValues))
    return (
      <form
        className='col-start-stretch'
        onSubmit={onSubmit}
        onReset={onReset}
      >
        <div
          className={`col-start-stretch
                      ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}
        >
          <v.FormDateElement
            name='dateFrom'
            label={i18n.xln(context, i18n.DATE_FROM)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'dateFrom'])}
          />
          <v.FormDateElement
            name='dateTo'
            label={i18n.xln(context, i18n.DATE_TO)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'dateTo'])}
          />
          <v.FormSelectElement
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
          </v.FormSelectElement>
          <v.FormSelectElement
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
          </v.FormSelectElement>
          <v.FormSelectElement
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
          </v.FormSelectElement>
          <v.FormTextElement
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

export const TransactoinFiltersForm = withRouter(connect<TransactionFiltersFormStateProps, {}, TransactionFiltersFormOwnProps, t.AppState>(state => ({
  categories: state.net.categories.categoryList,
  accounts: state.net.accounts.accountList,
  payees: state.net.payees.payeeList,
  pending: !fpx.isEmpty(state.net.pending),
}))(_TransactionFiltersForm))



/**
 * TransactionFiltersControls
 */

type TransactionFiltersControlsOwnProps = t.RRRouteComponentProps

type TransactionFiltersControlsStateProps = {
  transactions: t.TransactionRes[],
  pending     : boolean,
}

type TransactionFiltersControlsProps = TransactionFiltersControlsOwnProps & TransactionFiltersControlsStateProps


class _TransactionFiltersControls extends v.ViewComponent<TransactionFiltersControlsProps> {
  openDialog = () => {
    const {context} = this

    const closeDialog = () => {
      e.dispatch(a.removeDialog<d.FormDialogProps>(dialog))
    }

    const dialog = (
      <d.FormDialog
        title={i18n.xln(context, i18n.FILTERS)}
        onClose={closeDialog}
      >
        <TransactoinFiltersForm />
      </d.FormDialog>
    )

    e.dispatch(a.addDialog<d.FormDialogProps>(dialog))
  }

  onReset = () => {
    const {props: {history, location}} = this
    resetFilters(history, location)
  }

  render() {
    const {
      context,
      props: {location, transactions, pending},
      openDialog, onReset,
    } = this

    const noFilters = fpx.isEmpty(u.omitEmpty(parseFilters(location.search)))

    return (
      <div className='row-start-center padding-h-1 flex-wrap'>
        <div className='row-start-center gaps-h-0x5'>
          <v.FakeButton
            className='decorate-link'
            disabled={pending || !fpx.size(transactions)}
            onClick={openDialog}
          >
            {i18n.xln(context, i18n.FILTERS)}
          </v.FakeButton>
          {noFilters ? null :
          <v.FakeButton
            className='decorate-link row-center-center bg-primary rounded-50p'
            style={{padding: '2px'}}
            disabled={pending}
            onClick={onReset}
          >
            <s.X className='fg-surface' />
          </v.FakeButton>}
        </div>
      </div>
    )
  }
}

export const TransactionFiltersControls = withRouter(connect<TransactionFiltersControlsStateProps, {}, TransactionFiltersControlsOwnProps, t.AppState>(state => ({
  transactions: state.net.transactions.transactionList.items,
  pending: !fpx.isEmpty(state.net.pending),
}))(_TransactionFiltersControls))

function parseFilters(search: string): t.TransactionsFilterForm {
  const query = u.decodeQuery(search)

  return {
    dateFrom  : u.toValidDate(u.alwaysArray(query.dateFrom)[0]),
    dateTo    : u.toValidDate(u.alwaysArray(query.dateTo)[0]),
    accountId : u.alwaysArray(query.accountId)[0],
    categoryId: u.alwaysArray(query.categoryId)[0],
    payeeId   : u.alwaysArray(query.payeeId)[0],
    comment   : u.alwaysArray(query.comment)[0],
  }
}

function stringifyFilters(filters: t.TransactionsFilterForm): t.TransactionsFilter {
  return {
    dateFrom  : u.formatDate(filters.dateFrom),
    dateTo    : u.formatDate(filters.dateTo),
    accountId : filters.accountId,
    categoryId: filters.categoryId,
    payeeId   : filters.payeeId,
    comment   : filters.comment,
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
