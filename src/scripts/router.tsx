import * as t from './types'

import React from 'react'
import {connect} from 'react-redux'
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'

import * as e from './env'

import * as a from './actions'
import * as i18n from './i18n'

import {CategoriesPage} from './categories'
import {AccountsPage} from './accounts'
import {PayeesPage} from './payees'
import {TransactionsPage} from './transactions'
import {DashboardPage} from './dashboard'

import * as v from './views'

type RoutesProps = t.RRRouteComponentProps

class _Routes extends v.ViewComponent<RoutesProps> {
  unlisten: () => void = () => {}

  fetchAppData = (): Promise<[
    t.CategoryListRes,
    t.AccountListRes,
    t.PayeeListRes,
  ]> => {
    const {context} = this

    return e.dispatch(a.fetchUser(i18n.xln(context, i18n.FETCHING_USER)))
      .then(() => Promise.all<t.CategoryListRes, t.AccountListRes, t.PayeeListRes>([
        e.dispatch(a.fetchCategories(i18n.xln(context, i18n.FETCHING_CATEGORIES))),
        e.dispatch(a.fetchAccounts(i18n.xln(context, i18n.FETCHING_ACCOUNTS))),
        e.dispatch(a.fetchPayees(i18n.xln(context, i18n.FETCHING_PAYEES))),
      ]))
    }

  fetchRouteData = (location: t.RRLocation): Promise<
    t.TransactionListRes |
    t.CategoryListRes |
    t.AccountListRes |
    t.PayeeListRes |
    [t.AccountsBalancesRes, t.CategoriesSpendingsRes, t.PayeesDebtsRes] |
    void
  > => {
    const {context} = this
    const {pathname} = location

    if (new RegExp(`^/categories`, 'g').test(pathname)) {
      return e.dispatch(a.fetchCategories(i18n.xln(
        context,
        i18n.FETCHING_CATEGORIES
      )))
    }

    if (new RegExp(`^/accounts`, 'g').test(pathname)) {
      return e.dispatch(a.fetchAccounts(i18n.xln(
        context,
        i18n.FETCHING_ACCOUNTS
      )))
    }

    if (new RegExp(`^/payees`, 'g').test(pathname)) {
      return e.dispatch(a.fetchPayees(i18n.xln(
        context,
        i18n.FETCHING_PAYEES
      )))
    }

    if (new RegExp(`^/transactions`, 'g').test(pathname)) {
      return e.dispatch(a.fetchTransactions(location, i18n.xln(
        context,
        i18n.FETCHING_TRANSACTIONS
      )))
    }

    if (new RegExp(`^/dashboard`, 'g').test(pathname)) {
      return Promise.all<
        t.AccountsBalancesRes,
        t.CategoriesSpendingsRes,
        t.PayeesDebtsRes
      >([
        e.dispatch(a.fetchAccountsBalances(i18n.xln(
          context,
          i18n.FETCHING_ACCOUNTS_BALANCES
        ))),
        e.dispatch(a.fetchCategoriesSpendings(i18n.xln(
          context,
          i18n.FETCHING_ACCOUNTS_BALANCES
        ))),
        e.dispatch(a.fetchPayeesDebts(i18n.xln(
          context,
          i18n.FETCHING_PAYEES_DEBTS
        ))),
      ])
    }

    return Promise.resolve()
  }

  componentDidMount() {
    const {props: {history, location}} = this

    this.unlisten = history.listen(this.fetchRouteData)

    this.fetchAppData()
      .then(() => this.fetchRouteData(location))
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    return (
      <Switch>
        <Redirect from='/' to='/dashboard' exact />
        <Route path='/dashboard'              component={DashboardPage} />
        <Route path='/transactions'           component={TransactionsPage} />
        <Route path='/categories'             component={CategoriesPage} />
        <Route path='/accounts'               component={AccountsPage} />
        <Route path='/payees'                 component={PayeesPage} />
        <Route                                component={v.Page404} />
      </Switch>
    )
  }
}

export const Router = withRouter(connect()(_Routes))
