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
 * AccountPage
 */

type AccountPageProps = {}


export class AccountsPage extends v.ViewComponent<AccountPageProps> {
  openDialog = () => {
    const {context} = this

    const closeDialog = () => {
      e.dispatch(a.removeDialog<d.FormDialogProps>(dialog))
    }

    const dialog = (
      <d.FormDialog
        title={i18n.xln(context, i18n.NEW_ACCOUNT)}
        onClose={closeDialog}
      >
        <AccountForm onSubmitSuccess={closeDialog} />
      </d.FormDialog>
    )

    e.dispatch(a.addDialog<d.FormDialogProps>(dialog))
  }

  render() {
    const {openDialog} = this

    return (
      <v.ListPageLayout action={<v.Fab onClick={openDialog} />}>
        <AccountList />
      </v.ListPageLayout>
    )
  }
}



/**
 * AccountForm
 */

type AccountFormOwnProps = v.FormProps & {
  account?: t.AccountReq,
}

type AccountFormStateProps = {
  pending: boolean,
}

type AccountFormProps = AccountFormOwnProps & AccountFormStateProps

type AccountFormState = {
  formValues: t.AccountReq,
  errors    : undefined | t.ValidationError[],
}


class _AccountForm extends v.ViewComponent<AccountFormProps, AccountFormState> {
  readonly state = {
    formValues: this.props.account || {title: ''},
    errors: undefined,
  }

  fetchAccounts = () => {
    const {context} = this
    return e.dispatch(a.fetchAccounts(i18n.xln(context, i18n.FETCHING_ACCOUNTS)))
  }

  onSubmit = (event: t.RFormEvent) => {
    u.preventDefault(event)

    const {
      context,
      props: {onSubmitSuccess},
      state: {formValues},
    } = this

    this.setState({errors: undefined})

    const promise = formValues.id
      ? e.dispatch(a.updateAccount(
        formValues.id,
        formValues,
        i18n.xln(context, i18n.UPDATING_ACCOUNT)
      ))
      : e.dispatch(a.createAccount(
        formValues,
        i18n.xln(context, i18n.CREATING_ACCOUNT)
      ))

    promise
      .catch((errors: t.FetchError) => {
        this.setState({errors})
        throw errors
      })
      .then(() => onSubmitSuccess())
      .then(() => e.dispatch(a.addNotification(formValues.id
        ? i18n.xln(context, i18n.ACCOUNT_UPDATED)
        : i18n.xln(context, i18n.ACCOUNT_CREATED)
      )))
      .then(this.fetchAccounts)
  }

  onDelete = (event: v.FakeButtonEvent) => {
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
        question={i18n.xln(context, i18n.DELETE_ACCOUNT)}
        onConfirm={() => {
          closeDialog()
          e.dispatch(a.deleteAccount(
            formValues.id!,
            i18n.xln(context, i18n.DELETING_ACCOUNT)
          ))
            .then(() => onSubmitSuccess())
            .then(() => e.dispatch(a.addNotification(i18n.xln(context, i18n.ACCOUNT_DELETED))))
            .then(this.fetchAccounts)
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

const AccountForm = connect<AccountFormStateProps, {}, AccountFormOwnProps, t.AppState>((state) => ({
  pending: !fpx.isEmpty(state.net.pending),
}))(_AccountForm)



/**
 * AccountList
 */

type AccountListStateProps = {
  accounts: t.AccountListRes,
  pending : boolean,
}

type AccountListProps = AccountListStateProps


class _AccountList extends v.ViewComponent<AccountListProps> {
  fetchAccounts = () => {
    return
  }

  onOpen = (account: t.AccountRes) => () => {
    const {context} = this

    const closeDialog = () => {
      e.dispatch(a.removeDialog<d.FormDialogProps>(dialog))
    }

    const dialog = (
      <d.FormDialog
        title={i18n.xln(context, i18n.EDIT_ACCOUNT)}
        onClose={closeDialog}
      >
        <AccountForm
          account={account}
          onSubmitSuccess={closeDialog}
        />
      </d.FormDialog>
    )

    e.dispatch(a.addDialog<d.FormDialogProps>(dialog))
  }

  onDelete = (account: t.AccountRes) => () => {
    const {context} = this

    const closeDialog = () => {
      e.dispatch(a.removeDialog<d.ConfirmDialogProps>(dialog))
    }

    const dialog = (
      <d.ConfirmDialog
        question={i18n.xln(context, i18n.DELETE_ACCOUNT)}
        onConfirm={() => {
          closeDialog()
          e.dispatch(a.deleteAccount(
            account.id,
            i18n.xln(context, i18n.DELETING_ACCOUNT)
          ))
            .then(() => e.dispatch(a.addNotification(i18n.xln(context, i18n.ACCOUNT_DELETED))))
            .then(() => e.dispatch(a.fetchAccounts(i18n.xln(context, i18n.FETCHING_ACCOUNTS))))
        }}
        onClose={closeDialog}
      />
    )

    e.dispatch(a.addDialog<d.ConfirmDialogProps>(dialog))
  }

  render() {
    const {
      context, context: {isMobile},
      props: {accounts, pending},
      onOpen, onDelete,
    } = this

    return (
      <div className='col-start-stretch gaps-v-0x25'>
        <div
          className={`row-end-center
                      ${isMobile ? 'padding-t-0x5 padding-r-1' : 'padding-r-3x5'}`}
        >
          <span className='fg-on-surface-pale'>
            {i18n.xln(context, i18n.BALANCE)}
          </span>
        </div>
        <v.EntityList
          entityList={accounts}
          pending={pending}
        >
          {accounts.map((account) => (
            <v.Entity
              key={account.id}
              icon={<s.CreditCard className='font-large fg-primary' />}
              onOpen={onOpen(account)}
              onDelete={onDelete(account)}
            >
              <div className='flex-1 row-between-center gaps-h-1'>
                <span>{account.title}</span>
                { account.balance > 0
                ? <span className='fg-success'>+{account.balance}</span>
                : account.balance < 0
                ? <span className='fg-error'>{account.balance}</span>
                : <span className='fg-on-surface-pale'>{account.balance}</span>}
              </div>
            </v.Entity>
          ))}
        </v.EntityList>
      </div>
    )
  }
}

const AccountList = connect<AccountListStateProps, {}, {}, t.AppState>((state) => ({
  accounts: state.net.accounts.accountList,
  pending: !fpx.isEmpty(state.net.pending),
}))(_AccountList)
