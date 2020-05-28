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

import * as m from '../../views/misc'
import * as s from '../../views/svg'
import * as f from '../../views/forms'

import * as p from '../../views/pages'
import * as v from '../../views'

type TransactionFiltersFormOwnProps = p.FormProps<t.RRRouteComponentProps>

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

class _TransactionFiltersForm extends m.ViewComponent<TransactionFiltersFormProps, TransactionFiltersFormState> {
  readonly state = {
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
      onSubmitSuccess()
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
      context, context: {isMobile},
      props: {accounts, categories, payees, pending},
      state: {formValues},
      onSubmit, onReset,
    } = this

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

export const TransactoinFiltersForm = withRouter(connect<TransactionFiltersFormStateProps, {}, TransactionFiltersFormOwnProps, t.AppState>(state => ({
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
  openDialog = () => {
    const {context} = this

     e.dispatch(a.addDialog(p.FormDialog, {
      form: TransactoinFiltersForm,
      title: i18n.xln(context, i18n.FILTERS),
    }))
  }

  render() {
    const {
      context,
      props: {history, location, transactions, pending},
      openDialog,
    } = this

    const noFilters = fpx.isEmpty(u.omitEmpty(getFilterValues(location)))

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
            onClick={() => resetFilters(history, location)}
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
