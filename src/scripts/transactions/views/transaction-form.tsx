import * as t from '../../types'

import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

// @ts-ignore
import * as fpx from 'fpx'

import * as e from '../../env'
import * as u from '../../utils'

import * as a from '../../actions'

import * as i18n from '../../i18n'
import * as d from '../../dialogs'

import * as m from '../../views/misc'
import * as f from '../../views/forms'

import * as p from '../../views/pages'
import * as v from '../../views'

type TransactionFormOwnProps = t.RRRouteComponentProps & f.FormProps & {
  transaction?: t.TransactionReq,
}

type TransactionFormStateProps = {
  pending   : boolean,
  categories: t.CategoryListRes,
  accounts  : t.AccountListRes,
  payees    : t.PayeeListRes,
}

type TransactionFormProps = TransactionFormOwnProps & TransactionFormStateProps

type TransactionFormState = {
  formValues: t.TransactionReq,
  errors    : undefined | t.ValidationError[],
}


class _TransactionForm extends m.ViewComponent<TransactionFormProps, TransactionFormState> {
  readonly state = {
    formValues: this.props.transaction || {
      type: t.TRANSACTION_TYPE.OUTCOME,
      date: u.formatDate(new Date()),
    },
    errors: undefined,
  }

  fetchTransactions = () => {
    const {
      context,
      props: {location},
    } = this

    return e.dispatch(a.fetchTransactions(
      location,
      i18n.xln(context, i18n.FETCHING_TRANSACTIONS)
    ))
  }

  onSubmit = (event: t.RFormEvent) => {
    u.preventDefault(event)

    const {
      context,
      props: {onSubmitSuccess},
      state: {formValues},
    } = this

    this.setState({errors: undefined})

    const data = {
      ...formValues,
      date: u.formatDate(formValues.date),
    }

    const promise = formValues.id
      ? e.dispatch(a.updateTransaction(
          formValues.id,
          data,
          i18n.xln(context, i18n.UPDATING_TRANSACTION)
        ))
      : e.dispatch(a.createTransaction(
          data,
          i18n.xln(context, i18n.CREATING_TRANSACTION)
        ))

    promise
      .catch(errors => {
        this.setState({errors})
        throw errors
      })
      .then(() => onSubmitSuccess())
      .then(() => e.dispatch(a.addNotification(formValues.id
          ? i18n.xln(context, i18n.TRANSACTION_UPDATED)
          : i18n.xln(context, i18n.TRANSACTION_CREATED)
      )))
      .then(this.fetchTransactions)
  }

  onDelete = (event: v.FakeButtonEvent): void => {
    u.preventDefault(event)

    const {
      context,
      props: {onSubmitSuccess},
      state: {formValues},
    } = this

    this.setState({errors: undefined})

    const closeDialog = () => {
      e.dispatch(a.removeDialog<d.ConfirmDialogProps>(dialog))
    }

    const dialog = (
      <d.ConfirmDialog
        question={i18n.xln(context, i18n.DELETE_TRANSACTION)}
        onConfirm={() => {
          e.dispatch(a.deleteTransaction(
            formValues.id!,
            i18n.xln(context, i18n.DELETING_TRANSACTION)
          ))
            .then(() => onSubmitSuccess())
            .then(() => e.dispatch(a.addNotification(i18n.xln(context, i18n.TRANSACTION_DELETED))))
            .then(this.fetchTransactions)
        }}
        onClose={closeDialog}
      />
    )

    e.dispatch(a.addDialog<d.ConfirmDialogProps>(dialog))
  }

  onTypeUpdated = (value: string) => {
    const nextType = value as t.TRANSACTION_TYPE
    const {formValues} = this.state
    const {
      type,
      outcomeAccountId,
      outcomeAmount,
      incomeAccountId,
      incomeAmount,
    } = formValues

    const {INCOME, OUTCOME, LOAN, BORROW, TRANSFER} = t.TRANSACTION_TYPE

    if (
      fpx.includes([OUTCOME, LOAN], type) &&
      fpx.includes([INCOME, BORROW], nextType)
    ) {
      this.setState({
        formValues: {
          ...formValues,
          type: nextType,
          incomeAccountId : outcomeAccountId,
          incomeAmount    : outcomeAmount,
          outcomeAccountId: incomeAccountId,
          outcomeAmount   : incomeAmount,
        },
      })
      return
    }

    if (
      fpx.includes([INCOME, BORROW], type) &&
      fpx.includes([OUTCOME, LOAN], nextType)
    ) {
      this.setState({
        formValues: {
          ...formValues,
          type: nextType,
          outcomeAccountId: incomeAccountId,
          outcomeAmount   : incomeAmount,
          incomeAccountId : outcomeAccountId,
          incomeAmount    : outcomeAmount,
        },
      })
      return
    }

    if (
      fpx.includes([OUTCOME, LOAN], type) &&
      fpx.includes([TRANSFER], nextType)
    ) {
      this.setState({
        formValues: {
          ...formValues,
          type: nextType,
          incomeAmount: outcomeAmount,
        },
      })
      return
    }

    if (
      fpx.includes([INCOME, BORROW], type) &&
      fpx.includes([TRANSFER], nextType)
    ) {
      this.setState({
        formValues: {
          ...formValues,
          type: nextType,
          outcomeAmount: incomeAmount,
        },
      })
      return
    }

    this.setState({formValues: {
      ...formValues,
      type: nextType,
    }})
  }

  render() {
    const {
      context, context: {isMobile},
      state: {formValues: {type, id}, errors},
      props: {categories, accounts, payees, pending},
      onSubmit, onDelete, onTypeUpdated,
    } = this

    const {INCOME, OUTCOME, LOAN, BORROW, TRANSFER} = t.TRANSACTION_TYPE

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
            disabled={pending}
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
                    disabled={pending}
                    {...u.bindChecked(this, ['formValues', 'type'], OUTCOME)}
                    onUpdate={onTypeUpdated}
                  />
                  <span>{i18n.xln(context, i18n.OUTCOME)}</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={pending}
                    {...u.bindChecked(this, ['formValues', 'type'], INCOME)}
                    onUpdate={onTypeUpdated}
                  />
                  <span>{i18n.xln(context, i18n.INCOME)}</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={pending}
                    {...u.bindChecked(this, ['formValues', 'type'], TRANSFER)}
                    onUpdate={onTypeUpdated}
                  />
                  <span>{i18n.xln(context, i18n.TRANSFER)}</span>
                </label>
              </div>
              <div className={isMobile ? 'col-start-stretch gaps-v-0x5' : 'row-start-center gaps-h-1'}>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={pending}
                    {...u.bindChecked(this, ['formValues', 'type'], LOAN)}
                    onUpdate={onTypeUpdated}
                  />
                  <span>{i18n.xln(context, i18n.I_LOANED)}</span>
                </label>
                <label className='row-start-center gaps-h-0x5'>
                  <f.Radio
                    name='type'
                    disabled={pending}
                    {...u.bindChecked(this, ['formValues', 'type'], BORROW)}
                    onUpdate={onTypeUpdated}
                  />
                  <span>{i18n.xln(context, i18n.I_BORROWED)}</span>
                </label>
              </div>
            </div>
          </f.G7FormLine>

          {!fpx.includes([OUTCOME, LOAN, TRANSFER], type) ? null :
          <Fragment>
            <f.FormNumberElement
              step='0.01'
              name='outcomeAmount'
              label={i18n.xln(context, i18n.AMOUNT)}
              disabled={pending}
              {...u.bindValue(this, ['formValues', 'outcomeAmount'])}
            />
            <f.FormSelectElement
              name='outcomeAccountId'
              label={i18n.xln(context, i18n.ACCOUNT)}
              disabled={pending}
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

          {!fpx.includes([INCOME, BORROW, TRANSFER], type) ? null :
          <Fragment>
            <f.FormNumberElement
              step='0.01'
              name='incomeAmount'
              label={i18n.xln(context, i18n.AMOUNT)}
              disabled={pending}
              {...u.bindValue(this, ['formValues', 'incomeAmount'])}
            />
            <f.FormSelectElement
              name='incomeAccountId'
              label={i18n.xln(context, i18n.ACCOUNT)}
              disabled={pending}
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

          {!fpx.includes([OUTCOME, INCOME], type) ? null :
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
          </f.FormSelectElement>}

          {!fpx.includes([OUTCOME, INCOME, LOAN, BORROW], type) ? null :
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
          </f.FormSelectElement>}

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
            {!id ? null :
            <v.FakeButton
              className='btn-transparent'
              onClick={onDelete}
              disabled={pending}
            >
              {i18n.xln(context, i18n.DELETE)}
            </v.FakeButton>}
          </div>
          <button
            type='submit'
            className={`btn-primary ${isMobile ? '' : 'btn-wide'}`}
            disabled={pending}
          >
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

export const TransactionForm = withRouter(connect<TransactionFormStateProps, {}, TransactionFormOwnProps, t.AppState>(state => ({
  categories: state.net.categories.categoryList,
  accounts: state.net.accounts.accountList,
  payees: state.net.payees.payeeList,
  pending: !fpx.isEmpty(state.net.pending),
}))(_TransactionForm))
