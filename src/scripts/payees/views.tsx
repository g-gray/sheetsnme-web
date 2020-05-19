import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'

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

class _PayeesPage extends m.ViewComponent {
  render() {
    const {
      context,
      props: {dispatch},
    } = this

    const action = (
      <v.Fab
        onClick={() => dispatch(a.addDialog(p.FormDialog, {
          form: PayeeForm,
          title: i18n.xln(context, i18n.NEW_PAYEE),
        }))}
      />
    )

    return (
      <v.ListPage action={action}>
        <PayeesList />
      </v.ListPage>
    )
  }
}

export const PayeesPage = connect()(_PayeesPage)


type PayeeFormState = {
  formValues: t.PayeeRes,
  errors: undefined | t.ValidationError[],
}

type PayeeFormOwnProps = {
  payee: t.PayeeRes,
  onSubmitSuccess: () => void,
}

type PayeeFormStateProps = {
  pending: boolean,
}

type PayeeFormProps = PayeeFormOwnProps & PayeeFormStateProps

class _PayeeForm extends m.ViewComponent<PayeeFormProps, PayeeFormState> {
  state: Readonly<PayeeFormState> = {
    formValues: this.props.payee || {},
    errors: undefined,
  }

  onSubmit = (event: t.RFormEvent): void => {
    u.preventDefault(event)

    this.setState({errors: undefined})

    const {
      context,
      props: {dispatch, onSubmitSuccess},
      state: {formValues},
    } = this

    const promise = formValues.id
      ? dispatch(a.updatePayee(
        formValues.id,
        formValues,
        i18n.xln(context, i18n.UPDATING_PAYEE)
      ))
      : dispatch(a.createPayee(
        formValues,
        i18n.xln(context, i18n.CREATING_PAYEE)
      ))

    promise
      .catch(errors => {
        this.setState({errors})
        throw errors
      })
      .then(() => onSubmitSuccess())
      .then(() => dispatch(a.addNotification(formValues.id
        ? i18n.xln(context, i18n.PAYEE_UPDATED)
        : i18n.xln(context, i18n.PAYEE_CREATED)
      )))
      .then(() => dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES))))
  }

  onDelete = (event: v.FakeButtonEvent): void => {
    u.preventDefault(event)

    this.setState({errors: undefined})

    const {
      context,
      props: {dispatch, onSubmitSuccess},
      state: {formValues},
    } = this

    dispatch(a.addDialog(p.ConfirmDialog, {
      question: i18n.xln(context, i18n.DELETE_PAYEE),
      onConfirm: () => {
        dispatch(a.deletePayee(
          formValues.id,
          i18n.xln(context, i18n.DELETING_PAYEE)
        ))
          .then(() => onSubmitSuccess())
          .then(() => dispatch(a.addNotification(i18n.xln(context, i18n.PAYEE_DELETED))))
          .then(() => dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES))))
      },
    }))
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
        <div
          className={`col-start-stretch
                      ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}
        >
          <f.FormTextElement
            name='title'
            label={i18n.xln(context, i18n.TITLE)}
            disabled={disabled}
            {...u.bindValue(this, ['formValues', 'title'])} />
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

const PayeeForm = connect<PayeeFormStateProps, {}, PayeeFormOwnProps, t.AppState>(state => ({
  pending: !fpx.isEmpty(state.net.pending),
}))(_PayeeForm)


type PayeesListStateProps = {
  payees: t.PayeeListRes,
  pending: boolean,
}

type PayeesListProps = PayeesListStateProps

class _PayeesList extends m.ViewComponent<PayeesListProps> {
  onOpen = (payee: t.PayeeRes) => () => {
    const {context, props: {dispatch}} = this

    dispatch(a.addDialog(p.FormDialog, {
      form: PayeeForm,
      formProps: {payee},
      title: i18n.xln(context, i18n.EDIT_PAYEE),
    }))
  }

  onDelete = (payee: t.PayeeRes) => () => {
    const {context, props: {dispatch}} = this

    dispatch(a.addDialog(p.ConfirmDialog, {
      question: i18n.xln(context, i18n.DELETE_PAYEE),
      onConfirm: () => {
        dispatch(a.deletePayee(payee.id, i18n.xln(context, i18n.DELETING_PAYEE)))
          .then(() => dispatch(a.addNotification(i18n.xln(context, i18n.PAYEE_DELETED))))
          .then(() => dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES))))
      },
    }))
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
          {pending || !payees.length ? (
            <div className='col-start-stretch'>
              {new Array(payees.length || 3).fill(undefined).map((__, index) => (
                <p.EntityPlaceholder key={index} />
              ))}
            </div>
          ) : (
            <div className='col-start-stretch'>
              {payees.map(payee => (
                <p.EntityItem
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
                </p.EntityItem>
              ))}
            </div>
          )}
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
