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

import * as tf from './transaction-form'

type TransactionProps = t.RRRouteComponentProps & {
  transaction: t.TransactionRes,
}


class _Transaction extends v.ViewComponent<TransactionProps> {
  actionsRef = React.createRef<HTMLDivElement>()

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

  onOpen = (transaction: t.TransactionRes) => {
    return (event: v.FakeButtonEvent) => {
      const {context, actionsRef} = this

      const actionsNode = u.findDomNode(actionsRef.current)
      if (u.isAncestorOf(actionsNode, event.target)) {
        return
      }

      const closeDialog = () => {
        e.dispatch(a.removeDialog<d.FormDialogProps>(dialog))
      }

      const dialog = (
        <d.FormDialog
          title={i18n.xln(context, i18n.EDIT_TRANSACTION)}
          onClose={closeDialog}
        >
          <tf.TransactionForm
            transaction={transaction}
            onSubmitSuccess={closeDialog}
          />
        </d.FormDialog>
      )

      e.dispatch(a.addDialog<d.FormDialogProps>(dialog))
    }
  }

  onDelete = (transaction: t.TransactionRes) => () => {
    const {context} = this

    const closeDialog = () => {
      e.dispatch(a.removeDialog<d.ConfirmDialogProps>(dialog))
    }

    const dialog = (
      <d.ConfirmDialog
        question={i18n.xln(context, i18n.DELETE_TRANSACTION)}
        onConfirm={() => {
          e.dispatch(a.deleteTransaction(
            transaction.id,
            i18n.xln(context, i18n.DELETING_TRANSACTION)
          ))
            .then(() => e.dispatch(a.addNotification(i18n.xln(context, i18n.TRANSACTION_DELETED))))
            .then(this.fetchTransactions)
        }}
        onClose={closeDialog}
      />
    )

    e.dispatch(a.addDialog<d.FormDialogProps>(dialog))
  }

  render() {
    const {
      context: {isMobile},
      props: {transaction},
      onOpen, onDelete, actionsRef,
    } = this

    return (
      <v.FakeButton
        type='div'
        onClick={onOpen(transaction)}
        className='row-start-start gaps-h-1 padding-h-1 list-item trigger text-left theme-drawer-link-busy rounded'
      >
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
              onClick={onDelete(transaction)}
            >
              <s.Trash2 className='font-large' />
            </v.FakeButton>
          </div>
        </div>}
      </v.FakeButton>
    )
  }
}

export const Transaction = withRouter(connect()(_Transaction))



/**
 * TransactionMeta
 */

type TransactionMetaProps = {
  transaction: t.TransactionRes,
}


class TransactionMeta extends v.ViewComponent<TransactionMetaProps> {
  render() {
    const {
      context: {isMobile},
      props: {transaction},
    } = this

    if (isMobile) {
      return (
        <span className='col-start-start gaps-v-0x25'>
          <span>{transaction.date}</span>
          <span>{transaction.comment}</span>
        </span>
      )
    }

    return (
      <span>
        {transaction.date} {transaction.comment ? '·' : ''} {transaction.comment}
      </span>
    )
  }
}



type TransactionIconProps = {
  transaction: t.TransactionRes,
}


class TransactionIcon extends v.ViewComponent<TransactionIconProps> {
  render() {
    const {props: {transaction}} = this
    const {INCOME, OUTCOME, LOAN, BORROW} = t.TRANSACTION_TYPE

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



/**
 * TransactionAmount
 */

type TransactionAmountProps = {
  transaction: t.TransactionRes,
}


class TransactionAmount extends v.ViewComponent<TransactionAmountProps> {
  render() {
    const {props: {transaction}} = this
    const {INCOME, OUTCOME, LOAN, BORROW} = t.TRANSACTION_TYPE

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



/**
 * TransactionAccount
 */

type TransactionAccountOwnProps = {
  transaction: t.TransactionRes,
}

type TransactionAccountStateProps = {
  accountsById: t.AccountsById,
}

type TransactionAccountProps = TransactionAccountOwnProps & TransactionAccountStateProps


class _TransactionAccount extends v.ViewComponent<TransactionAccountProps> {
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



/**
 * TransactionOrigin
 */

type TransactionOriginOwnProps = {
  transaction: t.TransactionRes,
}

type TransactionOriginStateProps = {
  categoriesById: t.CategoriesById,
  payeesById    : t.PayeesById,
}

type TransactionOriginProps = TransactionOriginOwnProps & TransactionOriginStateProps

class _TransactionOrigin extends v.ViewComponent<TransactionOriginProps> {
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
