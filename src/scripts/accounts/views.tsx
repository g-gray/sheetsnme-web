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

type AccountPageProps = {}

class _AccountsPage extends m.ViewComponent<AccountPageProps> {
  render() {
    const {
      context,
      props: {dispatch},
    } = this

    const action = (
      <v.Fab
        onClick={() => dispatch(a.addDialog(p.FormDialog, {
          form: AccountForm,
          title: i18n.xln(context, i18n.NEW_ACCOUNT),
        }))}
      />
    )

    return (
      <v.ListPage action={action}>
        <AccountList />
      </v.ListPage>
    )
  }
}

export const AccountsPage = connect()(_AccountsPage)


type AccountFormStateProps = {
  pending: boolean,
}

type AccountFormOwnProps = {
  account: t.AccountRes,
  onSubmitSuccess: () => void,
}

type AccountFormProps = AccountFormStateProps & AccountFormOwnProps

type AccountFormState = {
  formValues: t.AccountReq,
  errors: void | t.ValidationError[],
}


class _AccountForm extends m.ViewComponent<AccountFormProps, AccountFormState> {
  readonly state = {
    formValues: this.props.account,
    errors: undefined,
  }

  onSubmit = (event: t.RFormEvent) => {
    u.preventDefault(event)

    const {
      context,
      props: {dispatch, onSubmitSuccess},
      state: {formValues},
    } = this

    this.setState({errors: undefined})

    const promise = formValues.id
      ? dispatch(a.updateAccount(
        formValues.id,
        formValues,
        i18n.xln(context, i18n.UPDATING_ACCOUNT)
      ))
      : dispatch(a.createAccount(
        formValues,
        i18n.xln(context, i18n.CREATING_ACCOUNT)
      ))

    promise
      .catch(errors => {
        this.setState({errors})
        throw errors
      })
      .then(() => onSubmitSuccess())
      .then(() => dispatch(a.addNotification(formValues.id
        ? i18n.xln(context, i18n.ACCOUNT_UPDATED)
        : i18n.xln(context, i18n.ACCOUNT_CREATED)
      )))
      .then(() => dispatch(a.fetchAccounts(i18n.xln(context, i18n.FETCHING_ACCOUNTS))))
  }

  onDelete = (event: v.FakeButtonEvent): void => {
    u.preventDefault(event)

    const {
      context,
      props: {dispatch, onSubmitSuccess},
      state: {formValues},
    } = this

    this.setState({errors: undefined})

    dispatch(a.addDialog(p.ConfirmDialog, {
      question: i18n.xln(context, i18n.DELETE_ACCOUNT),
      onConfirm: () => {
        dispatch(a.deleteAccount(
          formValues.id,
          i18n.xln(context, i18n.DELETING_ACCOUNT)
        ))
          .then(() => onSubmitSuccess())
          .then(() => dispatch(a.addNotification(i18n.xln(context, i18n.ACCOUNT_DELETED))))
          .then(() => dispatch(a.fetchAccounts(i18n.xln(context, i18n.FETCHING_ACCOUNTS))))
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

const AccountForm = connect<AccountFormStateProps, {}, AccountFormOwnProps, t.AppState>((state) => ({
  pending: !fpx.isEmpty(state.net.pending),
}))(_AccountForm)


type AccountListStateProps = {
  accounts: t.AccountListRes,
  pending: boolean,
}

type AccountListProps = AccountListStateProps

class _AccountList extends m.ViewComponent<AccountListProps> {
  onOpen = (account: t.AccountRes) => () => {
    const {context, props: {dispatch}} = this

    dispatch(a.addDialog(p.FormDialog, {
      form: AccountForm,
      formProps: {account},
      title: i18n.xln(context, i18n.EDIT_ACCOUNT),
    }))
  }

  onDelete = (account: t.AccountRes) => () => {
    const {context, props: {dispatch}} = this

    dispatch(a.addDialog(p.ConfirmDialog, {
      question: i18n.xln(context, i18n.DELETE_ACCOUNT),
      onConfirm: () => {
        dispatch(a.deleteAccount(account.id, i18n.xln(context, i18n.DELETING_ACCOUNT)))
          .then(() => dispatch(a.addNotification(i18n.xln(context, i18n.ACCOUNT_DELETED))))
          .then(() => dispatch(a.fetchAccounts(i18n.xln(context, i18n.FETCHING_ACCOUNTS))))
      },
    }))
  }

  render() {
    const {
      context,
      props: {accounts, pending},
      onOpen, onDelete,
    } = this

    const isMobile = g.isMobile(context)
    return (
      <div className='col-start-stretch gaps-v-2'>
        <div className='col-start-stretch gaps-v-0x25'>
          <div className={`row-end-center ${isMobile ? 'padding-t-0x5 padding-r-1' : 'padding-r-3x5'}`}>
            <span className='fg-on-surface-pale'>{i18n.xln(context, i18n.BALANCE)}</span>
          </div>
          {pending || !accounts.length ? (
            <div className='col-start-stretch'>
              {new Array(accounts.length || 3).fill(undefined).map((__, index) => (
                <p.EntityPlaceholder key={index} />
              ))}
            </div>
          ) : (
            <div className='col-start-stretch'>
              {accounts.map((account) => (
                <p.EntityItem
                  key={account.id}
                  icon={<s.CreditCard className='font-large fg-primary' />}
                  onOpen={onOpen(account)}
                  onDelete={onDelete(account)}>
                  <div className='flex-1 row-between-center gaps-h-1'>
                    <span>{account.title}</span>
                    { account.balance > 0
                    ? <span className='fg-success'>+{account.balance}</span>
                    : account.balance < 0
                    ? <span className='fg-error'>{account.balance}</span>
                    : <span className='fg-on-surface-pale'>{account.balance}</span>}
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

const AccountList = connect<AccountListStateProps, {}, {}, t.AppState>((state) => ({
  accounts: state.net.accounts.accountList,
  pending: !fpx.isEmpty(state.net.pending),
}))(_AccountList)
