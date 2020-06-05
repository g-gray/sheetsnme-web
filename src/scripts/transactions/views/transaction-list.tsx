import * as t from '../../types'

import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

// @ts-ignore
import * as fpx from 'fpx'

import * as i18n from '../../i18n'

import * as m from '../../views/misc'
import * as s from '../../views/svg'

import * as v from '../../views'

import * as tli from './transaction-list-item'
import * as tf from './transaction-filters'

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
      context, context: {isMobile},
      props: {outcomeAmount, incomeAmount, transactions, pageCount, pending},
    } = this

    return (
      <div className='col-start-stretch gaps-v-2'>
        <div className='col-start-stretch gaps-v-0x25'>
          <div
            className={`row-between-center
                        ${isMobile ? 'padding-t-0x5 padding-r-1' : 'padding-r-3x5'}`}
          >
            <tf.TransactionFiltersControls />
            {pending ? null :
            <div className='gaps-h-0x5'>
              <span className='gaps-h-0x5'>
                <span className='fg-on-surface-pale'>
                  {i18n.xln(context, i18n.OUTCOME)}:
                </span>
                <span className='fg-error'>-{outcomeAmount}</span>
              </span>
              <span className='fg-on-surface-pale'>/</span>
              <span className='gaps-h-0x5'>
                <span className='fg-on-surface-pale'>
                  {i18n.xln(context, i18n.INCOME)}:
                </span>
                <span className='fg-success'>+{incomeAmount}</span>
              </span>
              <span className='fg-on-surface-pale'>
                ({i18n.xln(context, i18n.WITHOUT_DEBTS_AND_TRANSFERS)})
              </span>
            </div>}
          </div>
          <v.EntityList
            entityList={transactions}
            pending={pending}
            Placeholder={TransactionListPlaceholder}
          >
            <div className='col-start-stretch'>
              {transactions.map(transaction => (
                <tli.Transaction
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          </v.EntityList>
        </div>
        {!transactions.length ? null :
        <v.Paginator pageCount={pageCount} />}
      </div>
    )
  }
}

export const TransactionsList = withRouter(connect<TransactionListStateProps, {}, TransactionListOwnProps, t.AppState>(state => {
  return {
    outcomeAmount: state.net.transactions.transactionList.outcomeAmount,
    incomeAmount : state.net.transactions.transactionList.incomeAmount,
    transactions : state.net.transactions.transactionList.items,
    pageCount    : Math.ceil(state.net.transactions.transactionList.total / state.net.transactions.transactionList.limit),
    pending      : !fpx.isEmpty(state.net.pending),
  }
})(_TransactionsList))



/**
 * TransactionListPlaceholder
 */

type TransactionListPlaceholderProps = {
  length: number,
}


export class TransactionListPlaceholder extends m.ViewComponent<TransactionListPlaceholderProps> {
  render() {
    const {props: {length}} = this

    return (
      <div className='col-start-stretch'>
        {fpx.range(0, length).map((key: number) => (
          <TransactionPlaceholder key={key} />
        ))}
      </div>
    )
  }
}



/**
 * TransactionPlaceholder
 */

class TransactionPlaceholder extends m.ViewComponent {
  render() {
    const {context: {isMobile}} = this

    return (
      <div className='row-start-center gaps-h-1 padding-h-1 list-item'>
        <div className='row-start-center padding-v-1'>
          <div className='relative width-2x5 square circle decorate-placeholder' />
        </div>
        <div className='flex-1 col-start-stretch transaction-line-height'>
          <div className='col-start-stretch gaps-v-0x25 padding-v-1'>
            <div className='row-between-center gaps-h-1 font-midsmall fg-on-surface-pale'>
              <v.Placeholder style={{width: '4em'}} />
              <v.Placeholder style={{width: '6em'}} />
            </div>
            <div className='row-between-start gaps-h-1'>
              <v.Placeholder style={{width: '8em'}} />
              <v.Placeholder style={{width: '3em'}} />
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
