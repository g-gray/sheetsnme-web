import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'

// @ts-ignore
import * as fpx from 'fpx'

import * as e from '../env'
import * as u from '../utils'

import * as a from '../actions'

import * as i18n from '../i18n'
import * as d from '../dialogs'

import * as v from '../views'
import * as s from '../views/svg'

/**
 * PayeePage
 */

type PayeePageProps = {}


export class PayeesPage extends v.ViewComponent<PayeePageProps> {
  openDialog = () => {
    const {context} = this

    const closeDialog = () => {
      e.dispatch(a.removeDialog<d.FormDialogProps>(dialog))
    }

    const dialog = (
      <d.FormDialog
        title={i18n.xln(context, i18n.NEW_PAYEE)}
        onClose={closeDialog}
      >
        <PayeeForm onSubmitSuccess={closeDialog} />
      </d.FormDialog>
    )

    e.dispatch(a.addDialog<d.FormDialogProps>(dialog))
  }

  render() {
    const {openDialog} = this

    return (
      <v.ListPage action={<v.Fab onClick={openDialog} />}>
        <PayeesList />
      </v.ListPage>
    )
  }
}



/**
 * PayeeForm
 */

type PayeeFormOwnProps = v.FormProps & {
  payee?: t.PayeeReq,
}

type PayeeFormStateProps = {
  pending: boolean,
}

type PayeeFormProps = PayeeFormOwnProps & PayeeFormStateProps

type PayeeFormState = {
  formValues: t.PayeeReq,
  errors    : undefined | t.ValidationError[],
}


class _PayeeForm extends v.ViewComponent<PayeeFormProps, PayeeFormState> {
  readonly state = {
    formValues: this.props.payee || {title: ''},
    errors: undefined,
  }

  fetchPayees = () => {
    const {context} = this
    return e.dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES)))
  }

  onSubmit = (event: t.RFormEvent): void => {
    u.preventDefault(event)

    const {
      context,
      props: {onSubmitSuccess},
      state: {formValues},
    } = this

    this.setState({errors: undefined})

    const promise = formValues.id
      ? e.dispatch(a.updatePayee(
        formValues.id,
        formValues,
        i18n.xln(context, i18n.UPDATING_PAYEE)
      ))
      : e.dispatch(a.createPayee(
        formValues,
        i18n.xln(context, i18n.CREATING_PAYEE)
      ))

    promise
      .catch((errors: t.FetchError) => {
        this.setState({errors})
        throw errors
      })
      .then(() => onSubmitSuccess())
      .then(() => e.dispatch(a.addNotification(formValues.id
        ? i18n.xln(context, i18n.PAYEE_UPDATED)
        : i18n.xln(context, i18n.PAYEE_CREATED)
      )))
      .then(this.fetchPayees)
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
        question={i18n.xln(context, i18n.DELETE_PAYEE)}
        onConfirm={() => {
          closeDialog()
          e.dispatch(a.deletePayee(
            formValues.id!,
            i18n.xln(context, i18n.DELETING_PAYEE)
          ))
            .then(() => onSubmitSuccess())
            .then(() => e.dispatch(a.addNotification(i18n.xln(context, i18n.PAYEE_DELETED))))
            .then(this.fetchPayees)
        }}
        onClose={closeDialog}
      />
    )

    e.dispatch(a.addDialog<d.ConfirmDialogProps>(dialog))
  }

  render() {
    const {
      context, context: {isMobile},
      state: {errors, formValues: {id}},
      props: {pending},
      onSubmit, onDelete,
    } = this

    return (
      <form
        className='col-start-stretch'
        onSubmit={onSubmit}
      >
        <div
          className={`col-start-stretch
                      ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}
        >
          <v.FormTextElement
            name='title'
            label={i18n.xln(context, i18n.TITLE)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'title'])}
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
            disabled={pending}>
            {i18n.xln(context, i18n.SUBMIT)}
          </button>
          <div className='flex-1' />
        </div>
        {!errors ? null :
        <hr className='hr margin-h-1x25' />}
        <v.FormErrors errors={errors} />
      </form>
    )
  }
}

const PayeeForm = connect<PayeeFormStateProps, {}, PayeeFormOwnProps, t.AppState>(state => ({
  pending: !fpx.isEmpty(state.net.pending),
}))(_PayeeForm)



/**
 * PayeeList
 */

type PayeesListStateProps = {
  payees : t.PayeeListRes,
  pending: boolean,
}

type PayeesListProps = PayeesListStateProps


class _PayeesList extends v.ViewComponent<PayeesListProps> {
  onOpen = (payee: t.PayeeRes) => () => {
    const {context} = this

    const closeDialog = () => {
      e.dispatch(a.removeDialog<d.FormDialogProps>(dialog))
    }

    const dialog = (
      <d.FormDialog
        title={i18n.xln(context, i18n.EDIT_PAYEE)}
        onClose={closeDialog}
      >
        <PayeeForm
          payee={payee}
          onSubmitSuccess={closeDialog}
        />
      </d.FormDialog>
    )

    e.dispatch(a.addDialog<d.FormDialogProps>(dialog))
  }

  onDelete = (payee: t.PayeeRes) => () => {
    const {context} = this

    const closeDialog = () => {
      e.dispatch(a.removeDialog<d.ConfirmDialogProps>(dialog))
    }

    const dialog = (
      <d.ConfirmDialog
        question={i18n.xln(context, i18n.DELETE_PAYEE)}
        onConfirm={() => {
          closeDialog()
          e.dispatch(a.deletePayee(
            payee.id,
            i18n.xln(context, i18n.DELETING_PAYEE)
          ))
            .then(() => e.dispatch(a.addNotification(i18n.xln(context, i18n.PAYEE_DELETED))))
            .then(() => e.dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES))))
        }}
        onClose={closeDialog}
      />
    )

    e.dispatch(a.addDialog<d.ConfirmDialogProps>(dialog))
  }

  render() {
    const {
      context, context: {isMobile},
      props: {payees, pending},
      onOpen, onDelete,
    } = this

    return (
      <div className='col-start-stretch gaps-v-2'>
        <div className='col-start-stretch gaps-v-0x25'>
          <div
            className={`row-end-center
                        ${isMobile ? 'padding-t-0x5 padding-r-1' : 'padding-r-3x5'}`}
          >
            <span className='fg-on-surface-pale'>
              {i18n.xln(context, i18n.DEBT)}
            </span>
          </div>
          <v.EntityList
            entityList={payees}
            pending={pending}
          >
            {payees.map(payee => (
              <v.Entity
                key={payee.id}
                icon={<s.Users className='font-large fg-primary' />}
                onOpen={onOpen(payee)}
                onDelete={onDelete(payee)}
              >
                <div className='flex-1 row-between-center gaps-h-1'>
                  <span>{payee.title}</span>
                  { payee.debt > 0
                  ? <span className='fg-success'>+{payee.debt}</span>
                  : payee.debt < 0
                  ? <span className='fg-error'>{payee.debt}</span>
                  : <span className='fg-on-surface-pale'>{payee.debt}</span>}
                </div>
              </v.Entity>
            ))}
          </v.EntityList>
        </div>
      </div>
    )
  }
}

const PayeesList = connect<PayeesListStateProps, {}, {}, t.AppState>(state => ({
  payees: fpx.sortBy(
    state.net.payees.payeeList,
    (payee: t.PayeeWithDebtRes) => !payee.debt ? Infinity : payee.debt
  ),
  pending: !fpx.isEmpty(state.net.pending),
}))(_PayeesList)
